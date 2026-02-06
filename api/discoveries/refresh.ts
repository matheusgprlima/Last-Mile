import { createLogger } from '../utils/logger.js';
import { fetchLatestDiscoveries } from '../../services/discoveryMonitor.js';

const log = createLogger('api/refresh');

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

  log.info('Cron or manual refresh started');

  try {
    const discoveries = await fetchLatestDiscoveries(true);
    log.info('Refresh done', { count: discoveries.length });
    res.status(200).json({
      success: true,
      count: discoveries.length,
      discoveries,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    log.warn('Error', { reason: err instanceof Error ? err.message : String(err) });
    res.status(200).json({
      success: true,
      count: 0,
      discoveries: [],
      timestamp: new Date().toISOString(),
    });
  }
}
