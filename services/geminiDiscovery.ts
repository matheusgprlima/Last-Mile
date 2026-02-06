/**
 * Gemini: formats raw news items into DiscoveryCards (single or batch).
 * Used by discoveryMonitor (API / server). Batch + concurrency for performance.
 */
import { GoogleGenAI } from '@google/genai';
import { DISCOVERY_FORMAT_INSTRUCTION, DISCOVERY_FORMAT_BATCH_INSTRUCTION } from '../constants.js';
import type { DiscoveryCard, DiscoveryResponse } from '../types.js';
import { createLogger } from '../api/utils/logger.js';

const log = createLogger('geminiDiscovery');

const apiKey = process.env.GEMINI_API_KEY;

function getClient(): GoogleGenAI | null {
  if (!apiKey?.trim()) return null;
  return new GoogleGenAI({ apiKey });
}

let _client: GoogleGenAI | null = null;
function client(): GoogleGenAI | null {
  if (!_client) _client = getClient();
  return _client;
}

export type RawNewsItem = {
  title: string;
  summary: string;
  link: string;
  sourceName: string;
  date?: string;
};

function buildPrompt(raw: RawNewsItem): string {
  return `Format this news item into one Discovery Card. Provide source_labels (short alias for the link).

Title: ${raw.title}
Summary: ${raw.summary}
URL: ${raw.link}
Source: ${raw.sourceName}
Date: ${raw.date || 'Recent'}`;
}

const SUMMARY_MAX = 280;

function buildBatchPrompt(items: RawNewsItem[]): string {
  return items
    .map(
      (raw, i) =>
        `--- ITEM ${i + 1} ---
Title: ${raw.title}
Summary: ${raw.summary.slice(0, SUMMARY_MAX)}${raw.summary.length > SUMMARY_MAX ? '...' : ''}
URL: ${raw.link}
Source: ${raw.sourceName}
Date: ${raw.date || 'Recent'}`
    )
    .join('\n\n');
}

export async function formatNewsItem(raw: RawNewsItem): Promise<DiscoveryCard | null> {
  const ai = client();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: buildPrompt(raw),
      config: {
        systemInstruction: DISCOVERY_FORMAT_INSTRUCTION,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (!text) return null;

    const parsed = JSON.parse(text) as DiscoveryResponse;
    if (parsed.rejected_items?.length && !parsed.discovery_cards?.length) {
      log.info('Item rejected', { reason: parsed.rejected_items[0]?.reason ?? 'unknown' });
      return null;
    }
    const card = parsed.discovery_cards?.[0] ?? null;
    if (!card) return null;
    log.info('Card accepted', { title: card.title?.slice(0, 50) });

    if (card.sources?.length && (!card.source_labels || card.source_labels.length !== card.sources.length)) {
      card.source_labels = card.sources.map(() => raw.sourceName);
    }
    return card;
  } catch (err) {
    log.warn('formatNewsItem failed', { reason: err instanceof Error ? err.message : String(err) });
    return null;
  }
}

/** Batch: one Gemini call for multiple items. Returns one result per input (card or null), same order. */
export async function formatNewsItemBatch(
  items: RawNewsItem[]
): Promise<(DiscoveryCard | null)[]> {
  const ai = client();
  if (!ai || items.length === 0) return items.map(() => null);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: buildBatchPrompt(items),
      config: {
        systemInstruction: DISCOVERY_FORMAT_BATCH_INSTRUCTION,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (!text) return items.map(() => null);

    const parsed = JSON.parse(text) as { results?: Array<{ card?: DiscoveryCard; rejected?: boolean; reason?: string }> };
    const results = parsed.results ?? [];

    const accepted: (DiscoveryCard | null)[] = [];
    for (let i = 0; i < items.length; i++) {
      const r = results[i];
      const raw = items[i];
      if (!r || r.rejected || !r.card) {
        if (r?.reason) log.info('Item rejected', { reason: r.reason });
        accepted.push(null);
        continue;
      }
      const card = r.card;
      if (card.sources?.length && (!card.source_labels || card.source_labels.length !== card.sources.length)) {
        card.source_labels = card.sources.map(() => raw.sourceName);
      }
      accepted.push(card);
    }
    if (accepted.some(Boolean)) log.info('Batch accepted', { count: accepted.filter(Boolean).length, total: items.length });
    return accepted;
  } catch (err) {
    log.warn('formatNewsItemBatch failed', { reason: err instanceof Error ? err.message : String(err) });
    return items.map(() => null);
  }
}
