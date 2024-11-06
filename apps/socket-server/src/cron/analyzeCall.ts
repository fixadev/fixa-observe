import vapi from "../utils/vapiClient";
import openai from "../utils/openAiClient";
import { AudioContext } from "web-audio-api";
// ... existing imports ...

export const analyzeCall = async (callId: string) => {
  const call = await vapi.calls.get(callId);
  if (!call.artifact?.stereoRecordingUrl) {
    return;
  }

  const response = await fetch(call.artifact?.stereoRecordingUrl);
  const arrayBuffer = await response.arrayBuffer();
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Get individual channels
  const leftChannel = audioBuffer.getChannelData(0);
  const rightChannel = audioBuffer.getChannelData(1);

  // If you need to create separate audio files from these channels
  const createMonoBuffer = (channel: Float32Array) => {
    const monoBuffer = audioContext.createBuffer(
      1,
      channel.length,
      audioBuffer.sampleRate,
    );
    monoBuffer.getChannelData(0).set(channel);
    return monoBuffer;
  };

  const leftBuffer = createMonoBuffer(leftChannel);
  const rightBuffer = createMonoBuffer(rightChannel);

  // Convert AudioBuffer to Blob
  const audioBlob = await audioBufferToBlob(leftBuffer);
  const audioFile = new File([audioBlob], "audio.wav", { type: "audio/wav" });

  const leftTranscript = await openai.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-1",
    language: "en",
    response_format: "verbose_json",
    timestamp_granularities: ["word"],
  });

  const audioBlobRight = await audioBufferToBlob(rightBuffer);
  const audioFileRight = new File([audioBlobRight], "audio.wav", {
    type: "audio/wav",
  });

  const rightTranscript = await openai.audio.transcriptions.create({
    file: audioFileRight,
    model: "whisper-1",
    language: "en",
    response_format: "verbose_json",
    timestamp_granularities: ["word"],
  });

  const originalTranscript = call.artifact?.transcript;

  console.log("originalTranscript", originalTranscript);
  console.log("openaitranscript", leftTranscript);
  console.log("openaitranscript", rightTranscript);
};

async function audioBufferToBlob(audioBuffer: AudioBuffer): Promise<Blob> {
  const wav = await encodeWAV(audioBuffer);
  return new Blob([wav], { type: "audio/wav" });
}

function encodeWAV(audioBuffer: AudioBuffer): Buffer {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const data = audioBuffer.getChannelData(0);

  const buffer = Buffer.alloc(44 + data.length * 2);

  // WAV header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + data.length * 2, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(format, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE((sampleRate * numChannels * bitDepth) / 8, 28);
  buffer.writeUInt16LE((numChannels * bitDepth) / 8, 32);
  buffer.writeUInt16LE(bitDepth, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(data.length * 2, 40);

  // Audio data
  let offset = 44;
  for (let i = 0; i < data.length; i++) {
    const sample = Math.max(-1, Math.min(1, data[i]));
    buffer.writeInt16LE(sample * 0x7fff, offset);
    offset += 2;
  }

  return buffer;
}
