import Parser from 'rss-parser';
import fs from 'fs/promises';
import path from 'path';
import type { DiscoveryCard } from '../types.js';
import { formatNewsItemBatch, type RawNewsItem } from './geminiDiscovery.js';
import { runWithConcurrencyLimit } from '../api/utils/concurrency.js';
import { createLogger } from '../api/utils/logger.js';

const log = createLogger('discoveryMonitor');

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

const BATCH_SIZE = 4;
const CONCURRENCY = 2;
const maxWithGemini = 8;
const BATCH_TIMEOUT_MS = 18_000;

const CACHE_PATH =
  typeof process !== 'undefined' && process.env.VERCEL
    ? path.join('/tmp', 'discoveryCache.json')
    : path.join(process.cwd(), 'data', 'discoveryCache.json');
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const RSS_SOURCES: { name: string; url: string }[] = [
  {
    name: 'Google News (trials & research)',
    url: 'https://news.google.com/rss/search?q=HIV+clinical+trial+vaccine+research+treatment+2025&hl=en-US&gl=US&ceid=US:en',
  },
  {
    name: 'WHO Africa (health)',
    url: 'https://www.afro.who.int/rss/featured-news.xml',
  },
  {
    name: 'WHO HIV',
    url: 'https://www.who.int/feeds/entity/hiv/en/feed.xml',
  },
  {
    name: 'UNAIDS',
    url: 'https://www.unaids.org/en/feeds/news',
  },
  {
    name: 'HIV.gov',
    url: 'https://www.hiv.gov/blog/rss-feed',
  },
];

export interface CacheEntry {
  timestamp: number;
  discoveries: DiscoveryCard[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseDate(pubDate: string | undefined): string {
  if (!pubDate) return new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const d = new Date(pubDate);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 400);
}

const HIV_KEYWORDS = [
  'hiv',
  'aids',
  'prep',
  'antiretroviral',
  ' art ',
  'art.',
  'arv',
  'viral load',
  '95-95-95',
  'unaids',
  'cabotegravir',
  'lenacapavir',
  'biktarvy',
  'bnab',
  'pep',
  'cd4',
  'undetectable',
  'u=u',
  'hiv/aids',
  'hiv prevention',
  'hiv treatment',
  'hiv vaccine',
  'hiv cure',
];

function isHIVRelated(text: string): boolean {
  const lower = text.toLowerCase();
  return HIV_KEYWORDS.some((k) => lower.includes(k));
}

function itemToDiscoveryCard(
  item: { title?: string; link?: string; content?: string; contentSnippet?: string; pubDate?: string },
  sourceName: string,
  index: number
): DiscoveryCard {
  const title = item.title || 'Untitled';
  const id = `${slugify(title)}-${index}-${Date.now().toString(36)}`;
  const summary = stripHtml(item.content || item.contentSnippet || title);
  const link = item.link || '';

  return {
    id,
    title,
    country_or_region: 'Global',
    discovery_type: 'Research',
    summary: summary || title,
    why_this_matters: 'Relevant HIV/AIDS news from an authoritative feed. See source for full context.',
    date_announced: parseDate(item.pubDate),
    sources: link ? [link] : [sourceName],
    source_labels: [sourceName],
    confidence_basis: `RSS feed: ${sourceName}`,
  };
}

async function readCache(): Promise<CacheEntry | null> {
  try {
    const raw = await fs.readFile(CACHE_PATH, 'utf-8');
    return JSON.parse(raw) as CacheEntry;
  } catch {
    return null;
  }
}

export async function writeCache(entry: CacheEntry): Promise<void> {
  try {
    const dir = path.dirname(CACHE_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(CACHE_PATH, JSON.stringify(entry, null, 2), 'utf-8');
  } catch (err) {
    log.warn('Could not write cache', { reason: err instanceof Error ? err.message : String(err) });
  }
}

function rssErrorShort(sourceName: string, err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes('404') || (err as { statusCode?: number }).statusCode === 404)
    return `${sourceName}: 404 (feed unavailable)`;
  if (msg.includes('ENOTFOUND')) return `${sourceName}: host not found`;
  if (msg.includes('Invalid character') || msg.includes('entity name'))
    return `${sourceName}: invalid XML`;
  if (msg.includes('timeout') || msg.includes('ETIMEDOUT')) return `${sourceName}: timeout`;
  return `${sourceName}: ${msg.slice(0, 60)}`;
}

export async function fetchLatestDiscoveries(forceRefresh = false): Promise<DiscoveryCard[]> {
  try {
    if (!forceRefresh) {
      const cached = await readCache();
      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        log.info('Cache hit', { count: cached.discoveries.length });
        return cached.discoveries;
      }
    }
    log.info('Fetching from RSS', { forceRefresh });

    const parser = new Parser({
      timeout: 15000,
      headers: { 'User-Agent': 'LastMile-HIV-Discovery-Monitor/1.0' },
    });

    const allItems: Array<{ item: Parser.Item; sourceName: string; index: number }> = [];
    let index = 0;

    for (const source of RSS_SOURCES) {
      try {
        const feed = await parser.parseURL(source.url);
        const recent = (feed.items || []).slice(0, 8);
        for (const item of recent) {
          allItems.push({ item, sourceName: source.name, index: index++ });
        }
      } catch (err) {
        const short = rssErrorShort(source.name, err);
        log.warn(`RSS failed: ${short}`);
      }
    }

    log.info('RSS fetch done', { itemsFromRss: allItems.length, sources: RSS_SOURCES.length });

  const seenTitles = new Set<string>();
  const discoveries: DiscoveryCard[] = [];
  const useGemini = Boolean(process.env.GEMINI_API_KEY?.trim());

  if (useGemini) log.info('Using Gemini to validate items', { batchSize: BATCH_SIZE, concurrency: CONCURRENCY });

  const notDiscoveryPhrases = [
    'lose access',
    'set to lose',
    'losing access',
    'funding cut',
    'funding cuts',
    'cuts to ',
    'cut access',
    'lose their',
    'could lose',
    'may lose',
    'at risk of losing',
    'explodes',
    'surges',
    'honeymoon',
    'crystal meth',
    'epidemic explodes',
    'epidemic surges',
    'fox news',
    'daily mail',
  ];

  if (useGemini) {
    const toProcess: { raw: RawNewsItem; index: number; sourceName: string }[] = [];
    for (const { item, sourceName, index } of allItems) {
      const title = (item.title || '').trim();
      const titleLower = title.toLowerCase();
      if (!title || seenTitles.has(titleLower)) continue;
      seenTitles.add(titleLower);
      const summary = stripHtml(item.content || item.contentSnippet || title);
      if (!isHIVRelated(title + ' ' + summary)) continue;
      toProcess.push({
        raw: {
          title: item.title || 'Untitled',
          summary,
          link: item.link || '',
          sourceName,
          date: item.pubDate,
        },
        index,
        sourceName,
      });
      if (toProcess.length >= maxWithGemini) break;
    }
    const chunks: { raw: RawNewsItem; index: number; sourceName: string }[][] = [];
    for (let i = 0; i < toProcess.length; i += BATCH_SIZE) {
      chunks.push(toProcess.slice(i, i + BATCH_SIZE));
    }
    const batchResults = await runWithConcurrencyLimit(chunks, CONCURRENCY, (chunk) =>
      withTimeout(
        formatNewsItemBatch(chunk.map((c) => c.raw)),
        BATCH_TIMEOUT_MS,
        chunk.map(() => null as DiscoveryCard | null)
      )
    );
    for (let c = 0; c < chunks.length; c++) {
      const batchCards = batchResults[c] ?? [];
      const chunkItems = chunks[c] ?? [];
      for (let i = 0; i < batchCards.length; i++) {
        const card = batchCards[i];
        if (!card) continue;
        const { raw, index, sourceName } = chunkItems[i];
        if (!isHIVRelated(card.title + ' ' + (card.summary ?? ''))) continue;
        card.id = card.id || `${slugify(raw.title)}-${index}-${Date.now().toString(36)}`;
        if (!card.source_labels?.length && card.sources?.length) {
          card.source_labels = card.sources.map(() => sourceName);
        }
        discoveries.push(card);
      }
    }
  } else {
    for (const { item, sourceName, index } of allItems) {
      const title = (item.title || '').trim();
      const titleLower = title.toLowerCase();
      if (!title || seenTitles.has(titleLower)) continue;
      seenTitles.add(titleLower);
      const summary = stripHtml(item.content || item.contentSnippet || title);
      if (!isHIVRelated(title + ' ' + summary)) continue;
      const looksLikeNonDiscovery = notDiscoveryPhrases.some((p) => titleLower.includes(p));
      if (looksLikeNonDiscovery) continue;
      discoveries.push(
        itemToDiscoveryCard(
          {
            title: item.title,
            link: item.link,
            content: item.content,
            contentSnippet: item.contentSnippet,
            pubDate: item.pubDate,
          },
          sourceName,
          index
        )
      );
    }
  }

    log.info('Fetch complete', {
      discoveries: discoveries.length,
      fromCache: false,
      useGemini,
    });
    const entry: CacheEntry = { timestamp: Date.now(), discoveries };
    await writeCache(entry);
    return discoveries;
  } catch (err) {
    log.warn('Fetch failed', { reason: err instanceof Error ? err.message : String(err) });
    const cached = await readCache();
    const fallback = cached?.discoveries ?? [];
    if (fallback.length) log.info('Returning cached fallback', { count: fallback.length });
    return fallback;
  }
}
