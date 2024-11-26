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
    p50: Math.round(sortedDurations[p50Index] * 1000) ?? 0,
    p90: Math.round(sortedDurations[p90Index] * 1000) ?? 0,
    p95: Math.round(sortedDurations[p95Index] * 1000) ?? 0,
  };
}
