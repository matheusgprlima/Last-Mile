import type { AnalysisResponse } from '../types';

const SESSION_STORAGE_KEY = 'last_mile_analysis_cache';
const MAX_MEMORY_ENTRIES = 50;
const MAX_SESSION_ENTRIES = 20;

/** Simple non-crypto hash for cache keys (fast, good enough for in-memory dedup). */
export function hashText(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 5) + h) ^ text.charCodeAt(i);
  }
  return (h >>> 0).toString(36);
}

const cache = new Map<string, AnalysisResponse>();

function loadFromSession(): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return;
    const obj = JSON.parse(raw) as Record<string, AnalysisResponse>;
    if (obj && typeof obj === 'object') {
      for (const [k, v] of Object.entries(obj)) {
        if (v && typeof v === 'object') cache.set(k, v);
      }
    }
  } catch {
    /* ignore */
  }
}

function persistToSession(): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    const entries = Array.from(cache.entries());
    const toStore = entries
      .slice(-MAX_SESSION_ENTRIES)
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {} as Record<string, AnalysisResponse>);
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(toStore));
  } catch {
    /* ignore */
  }
}

export function getCachedAnalysis(text: string): AnalysisResponse | null {
  const key = hashText(text);
  if (cache.has(key)) return cache.get(key)!;
  if (cache.size === 0) loadFromSession();
  return cache.get(key) ?? null;
}

export function setCachedAnalysis(text: string, result: AnalysisResponse): void {
  const key = hashText(text);
  if (cache.size >= MAX_MEMORY_ENTRIES) {
    const firstKey = cache.keys().next().value;
    if (firstKey != null) cache.delete(firstKey);
  }
  cache.set(key, result);
  persistToSession();
}
