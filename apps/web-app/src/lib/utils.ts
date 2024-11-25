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

// Create WAV header and format the channel data
export function createWavBlob(
  channelData: Float32Array,
  sampleRate: number,
): Blob {
  const numSamples = channelData.length;
  const buffer = new ArrayBuffer(44 + numSamples * 2); // 44 bytes for header + audio data
  const view = new DataView(buffer);

  // Write WAV header
  // "RIFF" identifier
  view.setUint8(0, 0x52); // R
  view.setUint8(1, 0x49); // I
  view.setUint8(2, 0x46); // F
  view.setUint8(3, 0x46); // F
  // File size
  view.setUint32(4, 36 + numSamples * 2, true);
  // "WAVE" identifier
  view.setUint8(8, 0x57); // W
  view.setUint8(9, 0x41); // A
  view.setUint8(10, 0x56); // V
  view.setUint8(11, 0x45); // E
  // "fmt " chunk
  view.setUint8(12, 0x66); // f
  view.setUint8(13, 0x6d); // m
  view.setUint8(14, 0x74); // t
  view.setUint8(15, 0x20); // " "
  // Length of format data
  view.setUint32(16, 16, true);
  // Format type (1 = PCM)
  view.setUint16(20, 1, true);
  // Number of channels
  view.setUint16(22, 1, true);
  // Sample rate
  view.setUint32(24, sampleRate, true);
  // Byte rate
  view.setUint32(28, sampleRate * 2, true);
  // Block align
  view.setUint16(32, 2, true);
  // Bits per sample
  view.setUint16(34, 16, true);
  // "data" identifier
  view.setUint8(36, 0x64); // d
  view.setUint8(37, 0x61); // a
  view.setUint8(38, 0x74); // t
  view.setUint8(39, 0x61); // a
  // Data chunk size
  view.setUint32(40, numSamples * 2, true);

  // Write audio data
  for (let i = 0; i < numSamples; i++) {
    view.setInt16(44 + i * 2, channelData[i]! * 32767, true);
  }

  return new Blob([buffer], { type: "audio/wav" });
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
    if (percentage <= 0.33) return "text-yellow-500";
    if (percentage <= 0.66) return "text-yellow-600";
    return "text-orange-500";
  }

  // Red zone (4000-6000+ms)
  const percentage = Math.min((ms - 4000) / 2000, 1);
  if (percentage <= 0.25) return "text-red-500";
  if (percentage <= 0.5) return "text-red-500";
  if (percentage <= 0.75) return "text-red-500";
  return "text-red-600";
}

export function getInterruptionsColor(numInterruptions: number): string {
  if (numInterruptions < 2) return "text-green-500";
  if (numInterruptions < 4) return "text-yellow-500";
  return "text-red-500";
}
