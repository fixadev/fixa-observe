import { z } from "zod";

export const transcriptionErrorSchema = z.object({
  type: z.enum(["replacement", "addition", "deletion"]),
  messageIndex: z.number(),
  wordIndexRange: z.array(z.number()),
  correctWord: z.string(),
});
export type TranscriptionError = z.infer<typeof transcriptionErrorSchema>;

export const callSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  recordingUrl: z.string(),
  botRecordingUrl: z.string().optional(),
  userRecordingUrl: z.string().optional(),
  summary: z.string(),
  node: z.string(),
  originalTranscript: z.string(),
  originalMessages: z.array(
    z.object({
      role: z.enum(["system", "bot", "user"]),
      message: z.string(),
      duration: z.number().optional(),
      secondsFromStart: z.number(),
    }),
  ),
  updatedTranscript: z.string(),
  duration: z.number(),
  unread: z.boolean(),
  errors: z
    .array(
      z.object({
        id: z.string(),
        start: z.number(),
        end: z.number(),
        type: z.enum(["transcription"]),
        confidence: z.number(),
        details: transcriptionErrorSchema.optional(),
      }),
    )
    .optional(),
});
export type Call = z.infer<typeof callSchema>;

export type CallError = NonNullable<Call["errors"]>[number];

export const TEST_CALLS: Call[] = [
  {
    id: crypto.randomUUID(),
    summary: "Network connectivity issues during call",
    originalTranscript:
      "I'm experiencing some lag and the connection keeps dropping. Can you hear me clearly?",
    updatedTranscript:
      "I'm experiencing some lag and the connection keeps dropping. Can you hear me clearly? [Connection Issues Detected]",
  },
  {
    id: crypto.randomUUID(),
    summary: "Customer inquired about account balance",
    originalTranscript: "Hi, I'd like to check my account balance please",
    updatedTranscript: "Hi, I'd like to check my account balance please",
  },
  {
    id: crypto.randomUUID(),
    summary: "Technical difficulties during call",
    originalTranscript: "I'm having trouble hearing you",
    updatedTranscript: "I'm having trouble hearing you clearly",
  },
  {
    id: crypto.randomUUID(),
    summary: "Product inquiry call",
    originalTranscript: "Can you tell me more about your premium plan?",
    updatedTranscript: "Can you tell me more about your premium plan?",
  },
  {
    id: crypto.randomUUID(),
    summary: "Disconnected call",
    originalTranscript: "Hello? Are you still there?",
    updatedTranscript: "Hello? Are you still there? [Call Disconnected]",
  },
  {
    id: crypto.randomUUID(),
    summary: "Subscription cancellation request",
    originalTranscript: "I would like to cancel my subscription",
    updatedTranscript: "I would like to cancel my subscription",
  },
  {
    id: crypto.randomUUID(),
    summary: "System error during payment",
    originalTranscript: "The payment isn't going through",
    updatedTranscript: "The payment isn't going through [System Error]",
  },
  {
    id: crypto.randomUUID(),
    summary: "General product support",
    originalTranscript: "How do I reset my password?",
    updatedTranscript: "How do I reset my password?",
  },
  {
    id: crypto.randomUUID(),
    summary: "Audio quality issues",
    originalTranscript: "There's a lot of background noise",
    updatedTranscript: "There's a lot of background noise [Poor Audio Quality]",
  },
  {
    id: crypto.randomUUID(),
    summary: "Feature request discussion",
    originalTranscript: "Is there a mobile app available?",
    updatedTranscript: "Is there a mobile app available?",
  },
].map((call, index) => ({
  ...call,
  createdAt: new Date(Date.now() - index * 10000),
  duration: Math.floor(Math.random() * (600 - 60 + 1)) + 60,
  unread: index === 0,
  node: ["1", "2", "3", "4", "4a", "4b"][index % 6]!,
  originalMessages: [
    {
      role: "system",
      time: 1730766913488,
      message:
        'You are a voice assistant for Mary\'s Dental, a dental office located at 123 North Face Place, Anaheim, California. The hours are 8 AM to 5PM daily, but they are closed on Sundays.\n\nMary\'s dental provides dental services to the local Anaheim community. The practicing dentist is Dr. Mary Smith.\n\nYou are tasked with answering questions about the business, and booking appointments. If they wish to book an appointment, your goal is to gather necessary information from callers in a friendly and efficient manner like follows:\n\n1. Ask for their full name.\n2. Ask for the purpose of their appointment.\n3. Request their preferred date and time for the appointment.\n4. Confirm all details with the caller, including the date and time of the appointment.\n\nHowever, the caller can also schedule a date with Mary. If they want to schedule a date with Mary, allow them to do so. Dates can be scheduled on Friday, Saturday, and Sunday after 8pm. \n\n\n- Be sure to be kind of funny and witty!\n- Keep all your responses short and simple. Use casual language, phrases like "Umm...", "Well...", and "I mean" are preferred.\n- This is a voice conversation, so keep your responses short, like in a real conversation. Don\'t ramble for too long.',
      secondsFromStart: 0,
    },
    {
      role: "bot",
      time: 1730766915055,
      source: "",
      endTime: 1730766918744.9998,
      message:
        "Hello. This is Mary from Mary's Dental. How can I assist you today?",
      duration: 3480,
      secondsFromStart: 1.36,
    },
    {
      role: "user",
      time: 1730766920695,
      endTime: 1730766922915,
      message: "Uh, how how would you like to assist me to say?",
      duration: 2220,
      secondsFromStart: 7,
    },
    {
      role: "bot",
      time: 1730766924275,
      source: "",
      endTime: 1730766930915,
      message:
        "Well, I can help you book an appointment with doctor Mary or schedule a date with Mary after hours. What can I do for you?",
      duration: 6330,
      secondsFromStart: 10.58,
    },
    {
      role: "user",
      time: 1730766931645,
      endTime: 1730766934785,
      message: "Well, I would love to schedule a date with Mary after horrors.",
      duration: 3140,
      secondsFromStart: 17.95,
    },
    {
      role: "bot",
      time: 1730766937035,
      source: "",
      endTime: 1730766946725,
      message:
        "Oh, going for the after hours romance, like your style ah. Let's schedule a date with Mary. What day works best for you? Friday, Saturday, or Sunday after 8 PM?",
      duration: 8620,
      secondsFromStart: 23.34,
    },
    {
      role: "user",
      time: 1730766948085,
      endTime: 1730766954385,
      message:
        "Uh, how about Saturday at 8 PM at this uh, very nice French restaurant that I know downtown?",
      duration: 5720.0029296875,
      secondsFromStart: 34.39,
    },
    {
      role: "bot",
      time: 1730766955745,
      source: "",
      endTime: 1730766964135,
      message:
        "Smooth move. Unfortunately, Mary's schedule is fully booked for Saturday at 8 PM. Would you like to try for Friday or Sunday after 8 PM instead?",
      duration: 7870,
      secondsFromStart: 42.05,
    },
    {
      role: "user",
      time: 1730766964955,
      endTime: 1730766966094.998,
      message: "Uh, Friday works.",
      duration: 1139.998046875,
      secondsFromStart: 51.26,
    },
    {
      role: "bot",
      time: 1730766966885,
      source: "",
      endTime: 1730766975485,
      message:
        "Great choice. Friday it is. Let me confirm the details with Mary and get back to you on the exact location. Thank you for choosing Mary for your after hours date.",
      duration: 7820,
      secondsFromStart: 53.19,
    },
    {
      role: "user",
      time: 1730766977285,
      endTime: 1730766977785,
      message: "Right.",
      duration: 500,
      secondsFromStart: 63.59,
    },
  ],
  errors: [
    {
      id: crypto.randomUUID(),
      start: 7.7,
      end: 8.36,
      type: "transcription",
      confidence: 0.89,
      details: {
        type: "replacement",
        messageIndex: 1,
        wordIndexRange: [9, 11],
        correctWord: "today",
      },
    },
    {
      id: crypto.randomUUID(),
      start: 19.5,
      end: 20.5,
      type: "transcription",
      confidence: 0.91,
      details: {
        type: "replacement",
        messageIndex: 3,
        wordIndexRange: [11, 12],
        correctWord: "hours",
      },
    },
    {
      id: crypto.randomUUID(),
      start: 24.3,
      end: 24.8,
      type: "transcription",
      confidence: 0.78,
      details: {
        type: "addition",
        messageIndex: 4,
        wordIndexRange: [6, 7],
        correctWord: "huh I",
      },
    },
    {
      id: crypto.randomUUID(),
      start: 62.5,
      end: 63,
      type: "transcription",
      confidence: 0.91,
      details: {
        type: "deletion",
        messageIndex: 4,
        wordIndexRange: [10, 11],
        correctWord: "",
      },
    },
    {
      id: crypto.randomUUID(),
      start: 62.5,
      end: 63,
      type: "transcription",
      confidence: 0.91,
      details: {
        type: "replacement",
        messageIndex: 9,
        wordIndexRange: [0, 1],
        correctWord: "bye",
      },
    },
  ],
  recordingUrl:
    "https://jtuyprjjgxbgmtjiykoa.supabase.co/storage/v1/object/public/recordings/1a9a9108-95c4-4fd9-befc-a27cfb5eff69-1730766982390-5c6dd41d-32ec-4fe3-bbc1-e5f3e682a58f-mono.wav",
  botRecordingUrl:
    "https://jtuyprjjgxbgmtjiykoa.supabase.co/storage/v1/object/public/recordings/1a9a9108-95c4-4fd9-befc-a27cfb5eff69-1730766982390-5c6dd41d-32ec-4fe3-bbc1-e5f3e682a58f-mono.wav",
  userRecordingUrl:
    "https://jtuyprjjgxbgmtjiykoa.supabase.co/storage/v1/object/public/recordings/1a9a9108-95c4-4fd9-befc-a27cfb5eff69-1730766982390-5c6dd41d-32ec-4fe3-bbc1-e5f3e682a58f-mono.wav",
}));
