import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
