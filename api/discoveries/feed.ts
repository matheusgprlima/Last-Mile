import { fetchLatestDiscoveries } from '../../server/services/discoveryMonitor';

export default async function handler(req: { method?: string }, res: { setHeader: (a: string, b: string) => void; status: (n: number) => { end: () => void; json: (o: object) => void }; json: (o: object) => void }) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const forceRefresh = req.method === 'POST';
    const discoveries = await fetchLatestDiscoveries(forceRefresh);
    res.status(200).json({
      success: true,
      count: discoveries.length,
      discoveries,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('[api/discoveries/feed]', err instanceof Error ? err.message : String(err));
    res.status(500).json({
      success: false,
      error: 'Failed to fetch discoveries',
      discoveries: [],
    });
  }
}
