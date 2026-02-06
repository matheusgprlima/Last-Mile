import type { AnalysisResponse } from '../types';
import { createLogger } from './utils/logger.js';

const log = createLogger('api/analyze');

function hashText(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 5) + h) ^ text.charCodeAt(i);
  }
  return (h >>> 0).toString(36);
}

const serverCache = new Map<string, AnalysisResponse>();
const MAX_ENTRIES = 100;

export default async function handler(
  req: { method?: string; body?: { text?: string } },
  res: {
    setHeader: (a: string, b: string) => void;
    status: (n: number) => { end: () => void; json: (o: object) => void };
    json: (o: object) => void;
  }
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
  if (!text) {
    res.status(400).json({ error: 'Missing or invalid body: { text: string }' });
    return;
  }

  try {
    const key = hashText(text);
    const cached = serverCache.get(key);
    if (cached) {
      log.info('Cache hit', { key: key.slice(0, 8) });
      res.status(200).json(cached);
      return;
    }

    const { analyzeEvidence } = await import('../services/geminiService.js');
    const data = await analyzeEvidence(text);
    if (serverCache.size >= MAX_ENTRIES) {
      const first = serverCache.keys().next().value;
      if (first != null) serverCache.delete(first);
    }
    serverCache.set(key, data);
    log.info('Analyzed', { key: key.slice(0, 8) });
    res.status(200).json(data);
  } catch (err) {
    log.warn('Error', { reason: err instanceof Error ? err.message : String(err) });
    res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
}
