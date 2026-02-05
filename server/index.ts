/**
 * Minimal Express backend: cron every hour to refresh HIV discovery feed from RSS,
 * exposes GET /api/discoveries/feed for the frontend.
 */
import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { fetchLatestDiscoveries } from './services/discoveryMonitor.js';

const PORT = Number(process.env.PORT) || 3001;
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.get('/api/discoveries/feed', async (_req, res) => {
  try {
    const discoveries = await fetchLatestDiscoveries(false);
    res.json({
      success: true,
      count: discoveries.length,
      discoveries,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[GET /api/discoveries/feed]', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch discoveries',
      discoveries: [],
    });
  }
});

app.post('/api/discoveries/refresh', async (_req, res) => {
  try {
    const discoveries = await fetchLatestDiscoveries(true);
    res.json({
      success: true,
      count: discoveries.length,
      discoveries,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[POST /api/discoveries/refresh]', err);
    res.status(500).json({
      success: false,
      error: 'Manual refresh failed',
      discoveries: [],
    });
  }
});

cron.schedule('0 * * * *', async () => {
  try {
    const count = (await fetchLatestDiscoveries(true)).length;
    console.log('[cron] Discovery refresh:', count, 'items');
  } catch (err) {
    console.warn('[cron] Discovery refresh failed:', err instanceof Error ? err.message : String(err));
  }
});

app.listen(PORT, () => {
  console.log(`Discovery API running at http://localhost:${PORT}`);
  void fetchLatestDiscoveries(true)
    .then((d) => console.log(`Initial discovery fetch: ${d.length} items`))
    .catch((err) => console.warn('Initial fetch failed:', err instanceof Error ? err.message : String(err)));
});
