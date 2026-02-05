/**
 * Gemini: formats a raw news item into a DiscoveryCard with source_labels (alias).
 * Used by discoveryMonitor (API / server). Prefer fast processing.
 */
import { GoogleGenAI } from '@google/genai';
import { DISCOVERY_FORMAT_INSTRUCTION } from '../constants';
import type { DiscoveryCard, DiscoveryResponse } from '../types';
import { createLogger } from '../api/utils/logger.js';

const log = createLogger('geminiDiscovery');

const apiKey = process.env.GEMINI_API_KEY;

function buildPrompt(raw: {
  title: string;
  summary: string;
  link: string;
  sourceName: string;
  date?: string;
}): string {
  return `Format this news item into one Discovery Card. Provide source_labels (short alias for the link).

Title: ${raw.title}
Summary: ${raw.summary}
URL: ${raw.link}
Source: ${raw.sourceName}
Date: ${raw.date || 'Recent'}`;
}

export async function formatNewsItem(raw: {
  title: string;
  summary: string;
  link: string;
  sourceName: string;
  date?: string;
}): Promise<DiscoveryCard | null> {
  if (!apiKey?.trim()) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
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
