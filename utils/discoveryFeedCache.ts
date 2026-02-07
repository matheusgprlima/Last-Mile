import type { DiscoveryCard } from '../types';

const FEED_CACHE_KEY = 'last_mile_feed_cache';
const LAST_FEED_FETCH_KEY = 'last_mile_feed_fetch_at';
const FEED_COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes

export interface FeedCache {
  discoveries: DiscoveryCard[];
  timestamp: number;
}

export function getFeedFromCache(): FeedCache | null {
  try {
    const raw = localStorage.getItem(FEED_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FeedCache;
    if (!parsed?.discoveries || !Array.isArray(parsed.discoveries)) return null;
    return { discoveries: parsed.discoveries, timestamp: parsed.timestamp || 0 };
  } catch {
    return null;
  }
}

export function setFeedCache(discoveries: DiscoveryCard[]): void {
  try {
    localStorage.setItem(
      FEED_CACHE_KEY,
      JSON.stringify({ discoveries, timestamp: Date.now() } as FeedCache)
    );
  } catch {
    /* ignore */
  }
}

function getLastFeedFetchTime(): number | null {
  try {
    const raw = localStorage.getItem(LAST_FEED_FETCH_KEY);
    if (!raw) return null;
    const t = parseInt(raw, 10);
    return Number.isFinite(t) ? t : null;
  } catch {
    return null;
  }
}

export function setLastFeedFetchTime(): void {
  try {
    localStorage.setItem(LAST_FEED_FETCH_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

/** True if we're allowed to call the feed API (force refresh bypasses cooldown). */
export function canFetchFeed(forceRefresh: boolean): boolean {
  if (forceRefresh) return true;
  const last = getLastFeedFetchTime();
  if (!last) return true;
  return Date.now() - last >= FEED_COOLDOWN_MS;
}

/** Prefetch discoveries and write to cache. Respects 15-min cooldown; use Refresh button to bypass. */
export function prefetchDiscoveries(): void {
  if (!canFetchFeed(false)) return;
  fetch('/api/discoveries/feed')
    .then((res) => res.json())
    .then((data: { success?: boolean; discoveries?: DiscoveryCard[] }) => {
      if (data.success && Array.isArray(data.discoveries) && data.discoveries.length > 0) {
        setFeedCache(data.discoveries);
        setLastFeedFetchTime();
      }
    })
    .catch(() => {
      /* ignore; cache will be used if available */
    });
}
