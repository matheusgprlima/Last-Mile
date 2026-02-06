/**
 * Run async tasks with a concurrency limit. Processes in waves of `limit` so we never
 * fire more than `limit` at once. Uses async/await; each wave is awaited before the next.
 */
export async function runWithConcurrencyLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  if (items.length === 0) return [];
  const results: R[] = [];
  for (let i = 0; i < items.length; i += limit) {
    const wave = items.slice(i, i + limit);
    const waveResults = await Promise.all(wave.map((item) => fn(item)));
    results.push(...waveResults);
  }
  return results;
}
