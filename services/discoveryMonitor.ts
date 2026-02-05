import Parser from 'rss-parser';
import fs from 'fs/promises';
import path from 'path';
import type { DiscoveryCard } from '../types';
import { formatNewsItem } from './geminiDiscovery';
import { log } from '../utils/logger';

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
    log.warn('discoveryMonitor', 'Could not write cache', { reason: err instanceof Error ? err.message : String(err) });
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
        log.info('discoveryMonitor', 'Cache hit', { count: cached.discoveries.length });
        return cached.discoveries;
      }
    }
    log.info('discoveryMonitor', 'Fetching from RSS', { forceRefresh });

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
        log.warn('discoveryMonitor', `RSS failed: ${short}`);
      }
    }

    log.info('discoveryMonitor', 'RSS fetch done', { itemsFromRss: allItems.length, sources: RSS_SOURCES.length });

  const seenTitles = new Set<string>();
  const discoveries: DiscoveryCard[] = [];
  const useGemini = Boolean(process.env.GEMINI_API_KEY?.trim());
  const maxWithGemini = 10;

  if (useGemini) log.info('discoveryMonitor', 'Using Gemini to validate items');

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

  for (const { item, sourceName, index } of allItems) {
    const title = (item.title || '').trim();
    const titleLower = title.toLowerCase();
    if (!title || seenTitles.has(titleLower)) continue;
    seenTitles.add(titleLower);

    const summary = stripHtml(item.content || item.contentSnippet || title);
    if (!isHIVRelated(title + ' ' + summary)) continue;

    if (useGemini) {
      const raw = {
        title: item.title || 'Untitled',
        summary,
        link: item.link || '',
        sourceName,
        date: item.pubDate,
      };
      const card = await formatNewsItem(raw);
      if (card) {
        if (!isHIVRelated(card.title + ' ' + (card.summary || ''))) continue;
        card.id = card.id || `${slugify(raw.title)}-${index}-${Date.now().toString(36)}`;
        if (!card.source_labels?.length && card.sources?.length)
          card.source_labels = card.sources.map(() => sourceName);
        discoveries.push(card);
      }
      continue;
    }

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

    log.info('discoveryMonitor', 'Fetch complete', {
      discoveries: discoveries.length,
      fromCache: false,
      useGemini,
    });
    const entry: CacheEntry = { timestamp: Date.now(), discoveries };
    await writeCache(entry);
    return discoveries;
  } catch (err) {
    log.warn('discoveryMonitor', 'Fetch failed', { reason: err instanceof Error ? err.message : String(err) });
    const cached = await readCache();
    const fallback = cached?.discoveries ?? [];
    if (fallback.length) log.info('discoveryMonitor', 'Returning cached fallback', { count: fallback.length });
    return fallback;
  }
}
