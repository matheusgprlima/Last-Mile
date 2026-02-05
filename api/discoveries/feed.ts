import { log } from '../../utils/logger';

export default async function handler(
  req: { method?: string; url?: string },
  res: {
    setHeader: (a: string, b: string) => void;
    status: (n: number) => { end: () => void; json: (o: object) => void };
    json: (o: object) => void;
  }
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const url = typeof req.url === 'string' ? req.url : '';
  const forceRefresh = req.method === 'POST' || url.includes('refresh=1');
  log.info('api/feed', 'Request', { method: req.method, forceRefresh });

  try {
    const { fetchLatestDiscoveries } = await import(
      '../../services/discoveryMonitor'
    ).catch((e: unknown) => {
      log.warn('api/feed', 'Module load failed', { reason: (e as Error)?.message ?? String(e) });
      return { fetchLatestDiscoveries: async () => [] as never[] };
    });
    const discoveries = await fetchLatestDiscoveries(forceRefresh);
    log.info('api/feed', 'Response', { count: discoveries.length });
    res.status(200).json({
      success: true,
      count: discoveries.length,
      discoveries,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    log.warn('api/feed', 'Error', { reason: err instanceof Error ? err.message : String(err) });
    res.status(200).json({
      success: true,
      count: 0,
      discoveries: [],
      timestamp: new Date().toISOString(),
      error: 'Feed temporarily unavailable',
    });
  }
}
