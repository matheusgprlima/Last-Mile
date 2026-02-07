import type { RegenerateHelpLinksResponse } from '../../types';
import { regenerateHelpLinks, type RegenerateHelpLinksInput } from '../../services/geminiService.js';
import { createLogger } from '../utils/logger.js';

const log = createLogger('api/help/regenerate-links');

function parseBody(body: unknown): RegenerateHelpLinksInput | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;
  const cardId = typeof b.cardId === 'string' ? b.cardId : '';
  const title = typeof b.title === 'string' ? b.title : '';
  const description = typeof b.description === 'string' ? b.description : '';
  const locationLabel = typeof b.locationLabel === 'string' ? b.locationLabel : '';
  if (!cardId || !title || !description || !locationLabel) return null;
  const currentLinkLabels = Array.isArray(b.currentLinkLabels)
    ? (b.currentLinkLabels as string[]).filter((x) => typeof x === 'string')
    : undefined;
  return { cardId, title, description, locationLabel, currentLinkLabels };
}

export default async function handler(
  req: { method?: string; body?: unknown },
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

  const input = parseBody(req.body);
  if (!input) {
    res.status(400).json({
      error: 'Missing or invalid body. Required: { cardId, title, description, locationLabel } (strings). Optional: currentLinkLabels (string[]).',
    });
    return;
  }

  try {
    const data: RegenerateHelpLinksResponse = await regenerateHelpLinks(input);
    log.info('Regenerated links', { cardId: input.cardId, count: data.links.length });
    res.status(200).json(data);
  } catch (err) {
    log.warn('Error', { reason: err instanceof Error ? err.message : String(err) });
    res.status(500).json({ error: 'Failed to regenerate links. Please try again.' });
  }
}
