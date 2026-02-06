import type { DiscoveryCard } from '../types';

export const FEED_CACHE_KEY = 'last_mile_feed_cache';

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

/** Prefetch discoveries and write to cache. Call when entering main app so Discoveries tab loads fast. */
export function prefetchDiscoveries(): void {
  fetch('/api/discoveries/feed')
    .then((res) => res.json())
    .then((data: { success?: boolean; discoveries?: DiscoveryCard[] }) => {
      if (data.success && Array.isArray(data.discoveries) && data.discoveries.length > 0) {
        setFeedCache(data.discoveries);
      }
    })
    .catch(() => {
      /* ignore; cache will be used if available */
    });
}
