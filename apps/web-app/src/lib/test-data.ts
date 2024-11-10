import type { Agent, RoleType, TestAgent } from "prisma/generated/zod";
import { type TestWithIncludes, type CallWithIncludes } from "./types";

export const TEST_AGENT: Agent = {
  id: "1",
  ownerId: "1",
  createdAt: new Date(),
  updatedAt: new Date(),
  name: "Test Agent",
  phoneNumber: "+1 (234) 567-8901",
  githubRepoUrl: "https://github.com/pixa-dev/pixa-drive-thru",
  systemPrompt: "Test system prompt",
};

export const TEST_TEST_AGENTS: TestAgent[] = [
  {
    id: "1",
    ownerId: null,
    name: "steve",
    headshotUrl: "/images/agent-avatars/steve.jpeg",
    description: "angry man who had a bad day",
    prompt: "Test prompt",
    vapiId: "test-vapi-id",
  },
  {
    id: "2",
    ownerId: null,
    name: "marge",
    headshotUrl: "/images/agent-avatars/marge.jpeg",
    description: "old lady with a temper",
    prompt: "Test prompt",
    vapiId: "test-vapi-id",
  },
  {
    id: "3",
    ownerId: null,
    name: "lily",
    headshotUrl: "/images/agent-avatars/lily.jpeg",
    description: "young woman who says 'like' a lot",
    prompt: "Test prompt",
    vapiId: "test-vapi-id",
  },
];

export const TEST_INTENTS = [
  {
    id: "1",
    name: "order food",
    instructions:
      "Help the customer place a food order. Get specific items, quantities, any special requests or dietary restrictions.",
    agentId: "test-agent-1",
  },
  {
    id: "2",
    name: "make reservation",
    instructions:
      "Assist in making a restaurant reservation. Collect date, time, party size, and any special accommodations needed.",
    agentId: "test-agent-1",
  },
  {
    id: "3",
    name: "general question",
    instructions:
      "Answer general questions about the restaurant including hours, location, menu items, or policies.",
    agentId: "test-agent-1",
  },
];

export const TEST_CALLS: CallWithIncludes[] = [
  {
    id: crypto.randomUUID(),
    status: "completed" as const,
    result: "success" as const,
    failureReason: null,
    testId: "1",
    testAgentId: "1",
    intentId: TEST_INTENTS[0]!.id,
    intent: TEST_INTENTS[0]!,
  },
  {
    id: crypto.randomUUID(),
    status: "completed" as const,
    result: "success" as const,
    failureReason: null,
    testId: "1",
    testAgentId: "1",
    intentId: TEST_INTENTS[1]!.id,
    intent: TEST_INTENTS[1]!,
  },
  {
    id: crypto.randomUUID(),
    status: "completed" as const,
    result: "failure" as const,
    failureReason: "Technical difficulties during call",
    testId: "1",
    testAgentId: "1",
    intentId: TEST_INTENTS[2]!.id,
    intent: TEST_INTENTS[2]!,
  },
  {
    id: crypto.randomUUID(),
    status: "completed" as const,
    result: "success" as const,
    failureReason: null,
    testId: "1",
    testAgentId: "1",
    intentId: TEST_INTENTS[0]!.id,
    intent: TEST_INTENTS[0]!,
  },
  {
    id: crypto.randomUUID(),
    status: "completed" as const,
    result: "failure" as const,
    failureReason: "Call disconnected",
    testId: "1",
    testAgentId: "1",
    intentId: TEST_INTENTS[1]!.id,
    intent: TEST_INTENTS[1]!,
  },
  {
    id: crypto.randomUUID(),
    status: "completed" as const,
    result: "success" as const,
    failureReason: null,
    testId: "1",
    testAgentId: "1",
    intentId: TEST_INTENTS[0]!.id,
    intent: TEST_INTENTS[0]!,
  },
  {
    id: crypto.randomUUID(),
    status: "completed" as const,
    result: "failure" as const,
    failureReason: "System error during payment",
    testId: "1",
    testAgentId: "1",
    intentId: TEST_INTENTS[2]!.id,
    intent: TEST_INTENTS[2]!,
  },
  {
    id: crypto.randomUUID(),
    status: "completed" as const,
    result: "success" as const,
    failureReason: null,
    testId: "1",
    testAgentId: "1",
    intentId: TEST_INTENTS[0]!.id,
    intent: TEST_INTENTS[0]!,
  },
  {
    id: crypto.randomUUID(),
    status: "completed" as const,
    result: "failure" as const,
    failureReason: "Audio quality issues",
    testId: "1",
    testAgentId: "1",
    intentId: TEST_INTENTS[1]!.id,
    intent: TEST_INTENTS[1]!,
  },
  {
    id: crypto.randomUUID(),
    status: "completed" as const,
    result: "success" as const,
    failureReason: null,
    testId: "1",
    testAgentId: "1",
    intentId: TEST_INTENTS[0]!.id,
    intent: TEST_INTENTS[0]!,
  },
].map((call, index) => ({
  ...call,
  createdAt: new Date(Date.now() - index * 10000),
  duration: Math.floor(Math.random() * (600 - 60 + 1)) + 60,
  unread: index === 0,
  node: ["1", "2", "3", "4", "4a", "4b"][index % 6]!,
  testAgent: TEST_TEST_AGENTS[Math.floor(Math.random() * 3)]!,
  messages: [
    {
      id: crypto.randomUUID(),
      role: "system" as RoleType,
      time: 1730766913488,
      message:
        'You are a voice assistant for Mary\'s Dental, a dental office located at 123 North Face Place, Anaheim, California. The hours are 8 AM to 5PM daily, but they are closed on Sundays.\n\nMary\'s dental provides dental services to the local Anaheim community. The practicing dentist is Dr. Mary Smith.\n\nYou are tasked with answering questions about the business, and booking appointments. If they wish to book an appointment, your goal is to gather necessary information from callers in a friendly and efficient manner like follows:\n\n1. Ask for their full name.\n2. Ask for the purpose of their appointment.\n3. Request their preferred date and time for the appointment.\n4. Confirm all details with the caller, including the date and time of the appointment.\n\nHowever, the caller can also schedule a date with Mary. If they want to schedule a date with Mary, allow them to do so. Dates can be scheduled on Friday, Saturday, and Sunday after 8pm. \n\n\n- Be sure to be kind of funny and witty!\n- Keep all your responses short and simple. Use casual language, phrases like "Umm...", "Well...", and "I mean" are preferred.\n- This is a voice conversation, so keep your responses short, like in a real conversation. Don\'t ramble for too long.',
      secondsFromStart: 0,
      duration: 0,
      endTime: 0,
      callId: call.id,
    },
    {
      id: crypto.randomUUID(),
      role: "bot" as RoleType,
      time: 1730766915055,
      source: "",
      endTime: 1730766918744.9998,
      message:
        "Hello. This is Mary from Mary's Dental. How can I assist you today?",
      duration: 3.48,
      secondsFromStart: 1.36,
      callId: call.id,
    },
    {
      id: crypto.randomUUID(),
      role: "user" as RoleType,
      time: 1730766920695,
      endTime: 1730766922915,
      message: "Uh, how how would you like to assist me to say?",
      duration: 2.22,
      secondsFromStart: 7,
      callId: call.id,
    },
    {
      id: crypto.randomUUID(),
      role: "bot" as RoleType,
      time: 1730766924275,
      source: "",
      endTime: 1730766930915,
      message:
        "Well, I can help you book an appointment with doctor Mary or schedule a date with Mary after hours. What can I do for you?",
      duration: 6.33,
      secondsFromStart: 10.58,
      callId: call.id,
    },
    {
      id: crypto.randomUUID(),
      role: "user" as RoleType,
      time: 1730766931645,
      endTime: 1730766934785,
      message: "Well, I would love to schedule a date with Mary after horrors.",
      duration: 3.14,
      secondsFromStart: 17.95,
      callId: call.id,
    },
    {
      id: crypto.randomUUID(),
      role: "bot" as RoleType,
      time: 1730766937035,
      source: "",
      endTime: 1730766946725,
      message:
        "Oh, going for the after hours romance, like your style ah. Let's schedule a date with Mary. What day works best for you? Friday, Saturday, or Sunday after 8 PM?",
      duration: 8.62,
      secondsFromStart: 23.34,
      callId: call.id,
    },
    {
      id: crypto.randomUUID(),
      role: "user" as RoleType,
      time: 1730766948085,
      endTime: 1730766954385,
      message:
        "Uh, how about Saturday at 8 PM at this uh, very nice French restaurant that I know downtown?",
      duration: 5.72,
      secondsFromStart: 34.39,
      callId: call.id,
    },
    {
      id: crypto.randomUUID(),
      role: "bot" as RoleType,
      time: 1730766955745,
      source: "",
      endTime: 1730766964135,
      message:
        "Smooth move. Unfortunately, Mary's schedule is fully booked for Saturday at 8 PM. Would you like to try for Friday or Sunday after 8 PM instead?",
      duration: 7.87,
      secondsFromStart: 42.05,
      callId: call.id,
    },
    {
      id: crypto.randomUUID(),
      role: "user" as RoleType,
      time: 1730766964955,
      endTime: 1730766966094.998,
      message: "Uh, Friday works.",
      duration: 1.139,
      secondsFromStart: 51.26,
      callId: call.id,
    },
    {
      id: crypto.randomUUID(),
      role: "bot" as RoleType,
      time: 1730766966885,
      source: "",
      endTime: 1730766975485,
      message:
        "Great choice. Friday it is. Let me confirm the details with Mary and get back to you on the exact location. Thank you for choosing Mary for your after hours date.",
      duration: 7.82,
      secondsFromStart: 53.19,
      callId: call.id,
    },
    {
      id: crypto.randomUUID(),
      role: "user" as RoleType,
      time: 1730766977285,
      endTime: 1730766977785,
      message: "Right.",
      duration: 0.5,
      secondsFromStart: 63.59,
      callId: call.id,
    },
  ],
  errors:
    call.result === "success"
      ? []
      : [
          {
            id: crypto.randomUUID(),
            secondsFromStart: 1.36,
            duration: 3.48,
            type: "",
            description:
              "agent did not mention correct business name in greeting",
            callId: call.id,
          },
          {
            id: crypto.randomUUID(),
            secondsFromStart: 50.36,
            duration: 2.48,
            type: "",
            description: "agent got order incorrect",
            callId: call.id,
          },
        ],
  stereoRecordingUrl:
    "https://jtuyprjjgxbgmtjiykoa.supabase.co/storage/v1/object/public/recordings/1a9a9108-95c4-4fd9-befc-a27cfb5eff69-1730766982390-5c6dd41d-32ec-4fe3-bbc1-e5f3e682a58f-mono.wav",
  botRecordingUrl:
    "https://jtuyprjjgxbgmtjiykoa.supabase.co/storage/v1/object/public/recordings/1a9a9108-95c4-4fd9-befc-a27cfb5eff69-1730766982390-5c6dd41d-32ec-4fe3-bbc1-e5f3e682a58f-mono.wav",
  userRecordingUrl:
    "https://jtuyprjjgxbgmtjiykoa.supabase.co/storage/v1/object/public/recordings/1a9a9108-95c4-4fd9-befc-a27cfb5eff69-1730766982390-5c6dd41d-32ec-4fe3-bbc1-e5f3e682a58f-mono.wav",
}));

export const TEST_TESTS: TestWithIncludes[] = [
  {
    id: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
    agentId: "test-agent-1",
    calls: TEST_CALLS,
  },
];
