import { log } from '../../server/utils/logger';

export default async function handler(
  _req: { method?: string },
  res: {
    setHeader: (a: string, b: string) => void;
    status: (n: number) => { end: () => void; json: (o: object) => void };
    json: (o: object) => void;
  }
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (_req.method === 'OPTIONS') return res.status(200).end();

  log.info('api/refresh', 'Cron or manual refresh started');

  try {
    const { fetchLatestDiscoveries } = await import(
      '../../server/services/discoveryMonitor'
    ).catch((e: unknown) => {
      log.warn('api/refresh', 'Module load failed', { reason: (e as Error)?.message ?? String(e) });
      return { fetchLatestDiscoveries: async () => [] as never[] };
    });
    const discoveries = await fetchLatestDiscoveries(true);
    log.info('api/refresh', 'Refresh done', { count: discoveries.length });
    res.status(200).json({
      success: true,
      count: discoveries.length,
      discoveries,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    log.warn('api/refresh', 'Error', { reason: err instanceof Error ? err.message : String(err) });
    res.status(200).json({
      success: true,
      count: 0,
      discoveries: [],
      timestamp: new Date().toISOString(),
    });
  }
}
