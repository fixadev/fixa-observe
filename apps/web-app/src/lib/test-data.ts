import type { RoleType, TestAgent } from "prisma/generated/zod";
import type {
  TestWithIncludes,
  CallWithIncludes,
  AgentWithIncludes,
} from "./types";
import { EvalResultType } from "@prisma/client";

export const TEST_TEST_AGENTS: TestAgent[] = [
  {
    id: "1",
    ownerId: null,
    name: "steve",
    headshotUrl: "/images/agent-avatars/steve.jpeg",
    description: "angry man who had a bad day",
    prompt: "Test prompt",
    enabled: true,
    defaultSelected: true,
    order: 0,
  },
  {
    id: "3",
    ownerId: null,
    name: "lily",
    headshotUrl: "/images/agent-avatars/lily.jpeg",
    description: "young woman who says 'like' a lot",
    prompt: "Test prompt",
    enabled: true,
    defaultSelected: false,
    order: 1,
  },
  {
    id: "2",
    ownerId: null,
    name: "marge",
    headshotUrl: "/images/agent-avatars/marge.jpeg",
    description: "old lady with a temper",
    prompt: "Test prompt",
    enabled: true,
    defaultSelected: false,
    order: 2,
  },
];

export const TEST_SCENARIOS: AgentWithIncludes["scenarios"] = [
  {
    id: "2",
    createdAt: new Date(),
    name: "make reservation",
    instructions:
      "Assist in making a restaurant reservation. Collect date, time, party size, and any special accommodations needed.",
    successCriteria: "Reservation was made successfully",
    agentId: "test-agent-1",
    isNew: false,
    includeDateTime: false,
    timezone: null,
    evals: [
      {
        id: crypto.randomUUID(),
        ownerId: null,
        name: "Reservation Details Completion",
        description:
          "Checks if all required reservation details were collected",
        type: "scenario" as const,
        createdAt: new Date(),
        agentId: null,
        scenarioId: null,
        resultType: "boolean" as const,
      },
      {
        id: crypto.randomUUID(),
        ownerId: null,
        name: "Accommodation Handling",
        description: "Evaluates how well special requests were handled",
        type: "scenario" as const,
        createdAt: new Date(),
        agentId: null,
        scenarioId: null,
        resultType: "boolean" as const,
      },
    ],
  },
  {
    id: "1",
    name: "order takeout",
    createdAt: new Date(),
    instructions:
      "Help the customer place a food order. Get specific items, quantities, any special requests or dietary restrictions.",
    successCriteria: "Order was placed successfully",
    agentId: "test-agent-1",
    isNew: false,
    includeDateTime: false,
    timezone: null,
    evals: [
      {
        id: crypto.randomUUID(),
        ownerId: null,
        name: "Order Accuracy Check",
        description:
          "Verifies if all order items and modifications were correctly captured",
        type: "scenario" as const,
        createdAt: new Date(),
        agentId: null,
        scenarioId: null,
        resultType: "boolean" as const,
      },
      {
        id: crypto.randomUUID(),
        ownerId: null,
        name: "Dietary Restrictions Handling",
        description: "Assesses handling of dietary requirements and allergies",
        type: "scenario" as const,
        createdAt: new Date(),
        agentId: null,
        scenarioId: null,
        resultType: "boolean" as const,
      },
    ],
  },
  {
    id: "3",
    name: "ask about menu",
    createdAt: new Date(),
    instructions:
      "Answer general questions about the restaurant including hours, location, menu items, or policies.",
    successCriteria: "Reservation was made successfully",
    agentId: "test-agent-1",
    isNew: false,
    includeDateTime: false,
    timezone: null,
    evals: [
      {
        id: crypto.randomUUID(),
        ownerId: null,
        name: "Menu Knowledge",
        description: "Evaluates accuracy of menu item descriptions and pricing",
        type: "scenario" as const,
        createdAt: new Date(),
        agentId: null,
        scenarioId: null,
        resultType: "boolean" as const,
      },
      {
        id: crypto.randomUUID(),
        ownerId: null,
        name: "Policy Communication",
        description: "Assesses clarity in explaining restaurant policies",
        type: "scenario" as const,
        createdAt: new Date(),
        agentId: null,
        scenarioId: null,
        resultType: "boolean" as const,
      },
    ],
  },
];

export const TEST_CALLS: CallWithIncludes[] = [
  {
    id: crypto.randomUUID(),
    status: "completed" as const,
    result: "success" as const,
    failureReason: null,
    testId: "1",
    scenarioId: TEST_SCENARIOS[0]!.id,
    scenario: TEST_SCENARIOS[0]!,
    customerCallId: "call.2mLTbvbnQZ785c96meHH1p",
  },
  {
    id: crypto.randomUUID(),
    status: "completed" as const,
    result: "failure" as const,
    failureReason: null,
    testId: "1",
    scenarioId: TEST_SCENARIOS[1]!.id,
    scenario: TEST_SCENARIOS[1]!,
    customerCallId: "call.2mLTbvbnQZ785c96meHH1p",
  },
  {
    id: crypto.randomUUID(),
    status: "completed" as const,
    result: "success" as const,
    failureReason: "Technical difficulties during call",
    testId: "1",
    scenarioId: TEST_SCENARIOS[2]!.id,
    scenario: TEST_SCENARIOS[2]!,
    customerCallId: "call.2mLTbvbnQZ785c96meHH1p",
  },
  {
    id: crypto.randomUUID(),
    status: "completed" as const,
    result: "success" as const,
    failureReason: null,
    testId: "1",
    scenarioId: TEST_SCENARIOS[0]!.id,
    scenario: TEST_SCENARIOS[0]!,
    customerCallId: "call.2mLTbvbnQZ785c96meHH1p",
  },
  {
    id: crypto.randomUUID(),
    status: "completed" as const,
    result: "failure" as const,
    failureReason: "Call disconnected",
    testId: "1",
    scenarioId: TEST_SCENARIOS[1]!.id,
    scenario: TEST_SCENARIOS[1]!,
    customerCallId: "call.2mLTbvbnQZ785c96meHH1p",
  },
  {
    id: crypto.randomUUID(),
    status: "completed" as const,
    result: "success" as const,
    failureReason: null,
    testId: "1",
    scenarioId: TEST_SCENARIOS[0]!.id,
    scenario: TEST_SCENARIOS[0]!,
    customerCallId: "call.2mLTbvbnQZ785c96meHH1p",
  },
  {
    id: crypto.randomUUID(),
    status: "completed" as const,
    result: "failure" as const,
    failureReason: "System error during payment",
    testId: "1",
    scenarioId: TEST_SCENARIOS[2]!.id,
    scenario: TEST_SCENARIOS[2]!,
    customerCallId: "call.2mLTbvbnQZ785c96meHH1p",
  },
  {
    id: crypto.randomUUID(),
    status: "completed" as const,
    result: "success" as const,
    failureReason: null,
    testId: "1",
    scenarioId: TEST_SCENARIOS[0]!.id,
    scenario: TEST_SCENARIOS[0]!,
    customerCallId: "call.2mLTbvbnQZ785c96meHH1p",
  },
  {
    id: crypto.randomUUID(),
    status: "completed" as const,
    result: "failure" as const,
    failureReason: "Audio quality issues",
    testId: "1",
    scenarioId: TEST_SCENARIOS[1]!.id,
    scenario: TEST_SCENARIOS[1]!,
    customerCallId: "call.2mLTbvbnQZ785c96meHH1p",
  },
  {
    id: crypto.randomUUID(),
    status: "completed" as const,
    result: "success" as const,
    failureReason: null,
    testId: "1",
    scenarioId: TEST_SCENARIOS[0]!.id,
    scenario: TEST_SCENARIOS[0]!,
    customerCallId: "call.2mLTbvbnQZ785c96meHH1p",
  },
].map((call, index) => ({
  ...call,
  startedAt: new Date(Date.now() - index * 10000).toISOString(),
  endedAt: new Date(
    Date.now() - index * 10000 + (Math.floor(Math.random() * 120000) + 60000),
  ).toISOString(),
  ownerId: null,
  duration: Math.floor(Math.random() * (600 - 60 + 1)) + 60,
  unread: index === 0,
  node: ["1", "2", "3", "4", "4a", "4b"][index % 6]!,
  testAgentId: (index % 3).toString(),
  testAgent: TEST_TEST_AGENTS[index % 3]!,
  messages: [
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
  ].map((message) => ({
    ...message,
    id: crypto.randomUUID(),
    name: "test-agent-1",
    result: call.result,
    toolCalls: [],
    callId: call.id,
  })),
  evalResults: call.scenario.evals.map((_eval, i) => ({
    id: crypto.randomUUID(),
    createdAt: new Date(),
    callId: call.id,
    eval: _eval,
    evalId: _eval.id,
    result: "",
    success: i % 2 === 0,
    // secondsFromStart: i * 5 + 9.599999 - 1.675,
    secondsFromStart: i * 15 + 9.599999 - 1.675,
    duration: 3.12 + 1.675,
    type: EvalResultType.boolean,
    details: "this is the reason that it failed or succeeded",
  })),
  // errors:
  //   call.result !== "success"
  //     ? [
  //         {
  //           id: crypto.randomUUID(),
  //           secondsFromStart: 9.599999 - 1.675,
  //           duration: 3.12 + 1.675,
  //           type: "missing_information",
  //           description:
  //             "agent failed to ask customer what type of pizza they wanted",
  //           callId: call.id,
  //         },
  //       ]
  //     : [],
  stereoRecordingUrl:
    "https://jtuyprjjgxbgmtjiykoa.supabase.co/storage/v1/object/public/recordings/1a9a9108-95c4-4fd9-befc-a27cfb5eff69-1730766982390-c7218bd2-42b9-47e4-9ce1-9c6dcf62e8d0-stereo.wav",
  monoRecordingUrl: null,
}));

export const TEST_OBSERVE_CALLS: CallWithIncludes[] = TEST_CALLS.map(
  (call) => ({
    ...call,
    test: null,
    testId: null,
    testAgent: null,
    testAgentId: null,
    scenario: null,
    scenarioId: null,
    evalResults: [],
    result: null,
  }),
);

export const TEST_TESTS: TestWithIncludes[] = [
  {
    id: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
    agentId: "test-agent-1",
    calls: TEST_CALLS,
    gitBranch: null,
    gitCommit: null,
    runFromApi: false,
  },
];

export const TEST_AGENT: AgentWithIncludes = {
  id: "1",
  ownerId: "1",
  createdAt: new Date(),
  updatedAt: new Date(),
  scenarios: TEST_SCENARIOS,
  name: "Test Agent",
  phoneNumber: "+1 (234) 567-8901",
  githubRepoUrl: "https://github.com/pixa-dev/pixa-drive-thru",
  systemPrompt: "Test system prompt",
  enabledTestAgents: [TEST_TEST_AGENTS[0]!, TEST_TEST_AGENTS[1]!],
  enableSlackNotifications: false,
  tests: TEST_TESTS,
};
