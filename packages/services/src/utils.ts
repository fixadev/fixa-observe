export function calculateLatencyPercentiles(durations: number[]) {
  if (durations.length === 0) {
    return { p50: 0, p90: 0, p95: 0 };
  }

  // Sort durations in ascending order
  const sortedDurations = [...durations].sort((a, b) => a - b);

  // Calculate indices for percentiles
  const p50Index = Math.floor(sortedDurations.length * 0.5);
  const p90Index = Math.floor(sortedDurations.length * 0.9);
  const p95Index = Math.floor(sortedDurations.length * 0.95);

  return {
    p50: sortedDurations[p50Index] ?? 0,
    p90: sortedDurations[p90Index] ?? 0,
    p95: sortedDurations[p95Index] ?? 0,
  };
}

export function getCreatedUpdatedDeleted<T extends { id: string }>(
  prior: T[],
  current: T[],
): { created: T[]; updated: T[]; deleted: T[] } {
  return {
    created: current.filter(
      (item) => !prior.some((priorItem) => priorItem.id === item.id),
    ),
    updated: current.filter((item) =>
      prior.some((priorItem) => priorItem.id === item.id),
    ),
    deleted: prior.filter(
      (item) => !current.some((currentItem) => currentItem.id === item.id),
    ),
  };
}

export function generateApiKey() {
  return `fx-${crypto.randomUUID()}`;
}
