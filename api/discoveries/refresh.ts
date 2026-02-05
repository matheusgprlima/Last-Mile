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

  try {
    const { fetchLatestDiscoveries } = await import(
      '../../server/services/discoveryMonitor'
    ).catch((e: unknown) => {
      console.warn('[api/discoveries/refresh] module load failed:', e);
      return { fetchLatestDiscoveries: async () => [] as never[] };
    });
    const discoveries = await fetchLatestDiscoveries(true);
    res.status(200).json({
      success: true,
      count: discoveries.length,
      discoveries,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('[api/discoveries/refresh]', err instanceof Error ? err.message : String(err));
    res.status(200).json({
      success: true,
      count: 0,
      discoveries: [],
      timestamp: new Date().toISOString(),
    });
  }
}
