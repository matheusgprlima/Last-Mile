/**
 * Server-side Gemini: formats a raw news item into a DiscoveryCard with source_labels (alias).
 * Prefer fast processing: single card, concise output, no commentary.
 */
import { GoogleGenAI } from '@google/genai';
import { DISCOVERY_FORMAT_INSTRUCTION } from '../../constants';
import type { DiscoveryCard, DiscoveryResponse } from '../../types';
import { log } from '../utils/logger.js';

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
      log.info('geminiDiscovery', 'Item rejected', { reason: parsed.rejected_items[0]?.reason ?? 'unknown' });
      return null;
    }
    const card = parsed.discovery_cards?.[0] ?? null;
    if (!card) return null;
    log.info('geminiDiscovery', 'Card accepted', { title: card.title?.slice(0, 50) });

    if (card.sources?.length && (!card.source_labels || card.source_labels.length !== card.sources.length)) {
      card.source_labels = card.sources.map(() => raw.sourceName);
    }
    return card;
  } catch (err) {
    log.warn('geminiDiscovery', 'formatNewsItem failed', { reason: err instanceof Error ? err.message : String(err) });
    return null;
  }
}
