import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CallResult } from "@prisma/client";
import { type Call, type LatencyBlock } from "prisma/generated/zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function removeTrailingSlash(path: string) {
  return path.replace(/\/+$/, "");
}

export function didCallSucceed(call: Call) {
  return call.result === CallResult.success;
}

export function formatDurationHoursMinutesSeconds(numSeconds: number): string {
  const hours = Math.floor(numSeconds / 3600);
  const minutes = Math.floor((numSeconds % 3600) / 60);
  const seconds = Math.floor(numSeconds % 60);

  const parts = [
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ];

  if (hours > 0) {
    parts.unshift(hours.toString().padStart(2, "0"));
  }

  return parts.join(":");
}

export function generateApiKey() {
  return `fx-${crypto.randomUUID()}`;
}

export function getLatencyBlockColor(
  latencyBlock: LatencyBlock,
  opacity = 0.2,
) {
  return `rgba(230, 118, 14, ${opacity})`;
  // return `rgba(255, 0, 0, ${opacity})`;
  // Convert duration to a percentage (assuming 3 seconds is 100% red)
  const percentage = Math.min(latencyBlock.duration / 3, 1);

  // Interpolate between green and red based on duration
  const red = Math.round(percentage * 255);
  const green = Math.round((1 - percentage) * 255);

  return `rgba(${red}, ${green}, 0, ${opacity})`;
}

export function getInterruptionColor(opacity = 0.2) {
  return `rgba(255, 0, 0, ${opacity})`;
}

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

export function getColors() {
  return ["sky-800", "sky-500", "sky-300"];
}

export function getLatencyColor(ms: number): string {
  // Green zone (0-3000ms)
  if (ms <= 3000) {
    const percentage = ms / 3000;
    if (percentage <= 0.25) return "text-green-400";
    if (percentage <= 0.5) return "text-green-500";
    if (percentage <= 0.75) return "text-green-600";
    return "text-green-700";
  }

  // Yellow/orange zone (3000-4000ms)
  if (ms <= 4000) {
    const percentage = (ms - 3000) / 1000;
    if (percentage <= 0.33) return "font-medium text-yellow-500";
    if (percentage <= 0.66) return "font-medium text-yellow-600";
    return "font-medium text-orange-500";
  }

  // Red zone (4000-6000+ms)
  const percentage = Math.min((ms - 4000) / 2000, 1);
  if (percentage <= 0.25) return "font-bold text-red-500";
  if (percentage <= 0.5) return "font-bold text-red-500";
  if (percentage <= 0.75) return "font-bold text-red-500";
  return "font-bold text-red-600";
}

export function getInterruptionsColor(numInterruptions: number): string {
  if (numInterruptions < 2) return "text-green-500";
  if (numInterruptions < 4) return "text-yellow-500";
  return "text-red-500";
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateTempId() {
  return `TEMP-${crypto.randomUUID()}`;
}

export function isTempId(id: string) {
  return id.startsWith("TEMP-");
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
