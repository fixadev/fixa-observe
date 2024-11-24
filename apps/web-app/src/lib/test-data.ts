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
    id: "1",
    status: "completed" as const,
    result: "success" as const,
    failureReason: null,
    testId: "1",
    scenarioId: TEST_SCENARIOS[0]!.id,
    scenario: TEST_SCENARIOS[0]!,
    customerCallId: "call.2mLTbvbnQZ785c96meHH1p",
  },
  {
    id: "2",
    status: "completed" as const,
    result: "failure" as const,
    failureReason: null,
    testId: "1",
    scenarioId: TEST_SCENARIOS[1]!.id,
    scenario: TEST_SCENARIOS[1]!,
    customerCallId: "call.2mLTbvbnQZ785c96meHH1p",
  },
  {
    id: "3",
    status: "completed" as const,
    result: "success" as const,
    failureReason: "Technical difficulties during call",
    testId: "1",
    scenarioId: TEST_SCENARIOS[2]!.id,
    scenario: TEST_SCENARIOS[2]!,
    customerCallId: "call.2mLTbvbnQZ785c96meHH1p",
  },
  {
    id: "4",
    status: "completed" as const,
    result: "success" as const,
    failureReason: null,
    testId: "1",
    scenarioId: TEST_SCENARIOS[0]!.id,
    scenario: TEST_SCENARIOS[0]!,
    customerCallId: "call.2mLTbvbnQZ785c96meHH1p",
  },
  {
    id: "5",
    status: "completed" as const,
    result: "failure" as const,
    failureReason: "Call disconnected",
    testId: "1",
    scenarioId: TEST_SCENARIOS[1]!.id,
    scenario: TEST_SCENARIOS[1]!,
    customerCallId: "call.2mLTbvbnQZ785c96meHH1p",
  },
  {
    id: "6",
    status: "completed" as const,
    result: "success" as const,
    failureReason: null,
    testId: "1",
    scenarioId: TEST_SCENARIOS[0]!.id,
    scenario: TEST_SCENARIOS[0]!,
    customerCallId: "call.2mLTbvbnQZ785c96meHH1p",
  },
  {
    id: "7",
    status: "completed" as const,
    result: "failure" as const,
    failureReason: "System error during payment",
    testId: "1",
    scenarioId: TEST_SCENARIOS[2]!.id,
    scenario: TEST_SCENARIOS[2]!,
    customerCallId: "call.2mLTbvbnQZ785c96meHH1p",
  },
  {
    id: "8",
    status: "completed" as const,
    result: "success" as const,
    failureReason: null,
    testId: "1",
    scenarioId: TEST_SCENARIOS[0]!.id,
    scenario: TEST_SCENARIOS[0]!,
    customerCallId: "call.2mLTbvbnQZ785c96meHH1p",
  },
  {
    id: "9",
    status: "completed" as const,
    result: "failure" as const,
    failureReason: "Audio quality issues",
    testId: "1",
    scenarioId: TEST_SCENARIOS[1]!.id,
    scenario: TEST_SCENARIOS[1]!,
    customerCallId: "call.2mLTbvbnQZ785c96meHH1p",
  },
  {
    id: "10",
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
      id: "b64e039e-a3d3-40c7-9ec9-bf1002624355",
      role: "bot" as RoleType,
      message:
        "Hello. This is Mary from Mary's Dental. How can I assist you today?",
      time: 0,
      endTime: 0,
      secondsFromStart: 0.39999998,
      duration: 3.62000002,
      name: "",
      result: "",
      toolCalls: [],
      callId: "e12e3552-df06-4254-a725-00d9c80f48a3",
    },
    {
      id: "fa731af8-7d1e-4008-9690-b005cd1840ca",
      role: "user" as RoleType,
      message: "How how would you like to assist me today?",
      time: 0,
      endTime: 0,
      secondsFromStart: 6.16,
      duration: 2.1,
      name: "",
      result: "",
      toolCalls: [],
      callId: "e12e3552-df06-4254-a725-00d9c80f48a3",
    },
    {
      id: "32a12629-a19d-4ec5-91a0-c549dbb1d6c2",
      role: "bot" as RoleType,
      message:
        "Well, I can help you book an appointment with doctor Mary or schedule a date with Mary after hours. What can I do for you?",
      time: 0,
      endTime: 0,
      secondsFromStart: 9.5199995,
      duration: 11.6449995,
      name: "",
      result: "",
      toolCalls: [],
      callId: "e12e3552-df06-4254-a725-00d9c80f48a3",
    },
    {
      id: "00d80695-bca4-4fcd-802f-e1e3a420adc9",
      role: "user" as RoleType,
      message: "Well, I would love to schedule a date with Mary after hours.",
      time: 0,
      endTime: 0,
      secondsFromStart: 16.895,
      duration: 3.140000000000001,
      name: "",
      result: "",
      toolCalls: [],
      callId: "e12e3552-df06-4254-a725-00d9c80f48a3",
    },
    {
      id: "225ca57d-c23d-4cd5-9894-42a23a80be6f",
      role: "bot" as RoleType,
      message:
        "Oh, going for the after hours romance. I like your style. Let's schedule a date with Mary. What day works best for you? Friday, Saturday, or Sunday after 8 PM?",
      time: 0,
      endTime: 0,
      secondsFromStart: 22.185,
      duration: 9.935002999999998,
      name: "",
      result: "",
      toolCalls: [],
      callId: "e12e3552-df06-4254-a725-00d9c80f48a3",
    },
    {
      id: "dbb0d607-43fa-47b2-ac69-02a8a493a3b5",
      role: "user" as RoleType,
      message:
        "How about Saturday at 8 PM at this, very nice French restaurant that I know downtown?",
      time: 0,
      endTime: 0,
      secondsFromStart: 33.49,
      duration: 6.18,
      name: "",
      result: "",
      toolCalls: [],
      callId: "e12e3552-df06-4254-a725-00d9c80f48a3",
    },
    {
      id: "d4fca54a-2561-450b-b6f9-e98d20327a70",
      role: "bot" as RoleType,
      message:
        "Smooth move. Unfortunately, Mary's schedule is fully booked for Saturday at 8 PM. Would you like to try for Friday or Sunday after 8 PM instead?",
      time: 0,
      endTime: 0,
      secondsFromStart: 41.155,
      duration: 8.259996999999998,
      name: "",
      result: "",
      toolCalls: [],
      callId: "e12e3552-df06-4254-a725-00d9c80f48a3",
    },
    {
      id: "2ff4721e-7fd1-466a-8d46-aff67a1dc020",
      role: "user" as RoleType,
      message: "Friday works.",
      time: 0,
      endTime: 0,
      secondsFromStart: 50.445,
      duration: 0.899996999999999,
      name: "",
      result: "",
      toolCalls: [],
      callId: "e12e3552-df06-4254-a725-00d9c80f48a3",
    },
    {
      id: "bc93752f-7b01-4742-97fa-8d7351dad636",
      role: "bot" as RoleType,
      message:
        "Great choice. Friday it is. Let me confirm the details with Mary and get back to you on the exact location. Thank you for choosing Mary for your after hours date.",
      time: 0,
      endTime: 0,
      secondsFromStart: 52.050003,
      duration: 8.82,
      name: "",
      result: "",
      toolCalls: [],
      callId: "e12e3552-df06-4254-a725-00d9c80f48a3",
    },
    {
      id: "0cbdbbee-455f-45bb-abe8-e3f531d5141a",
      role: "user" as RoleType,
      message: "Fine.",
      time: 0,
      endTime: 0,
      secondsFromStart: 62.57494,
      duration: 0.5,
      name: "",
      result: "",
      toolCalls: [],
      callId: "e12e3552-df06-4254-a725-00d9c80f48a3",
    },
    {
      id: "1bb36475-faf0-4aab-83b5-33de5f05863c",
      role: "bot" as RoleType,
      message: "Is there anything else I can help?",
      time: 0,
      endTime: 0,
      secondsFromStart: 63.730003,
      duration: 1.489996999999995,
      name: "",
      result: "",
      toolCalls: [],
      callId: "e12e3552-df06-4254-a725-00d9c80f48a3",
    },
    {
      id: "e43d2867-48cd-40a7-a1c8-314bd2d0dbc2",
      role: "user" as RoleType,
      message: "Yeah.",
      time: 0,
      endTime: 0,
      secondsFromStart: 64.73494,
      duration: 0.4850600000000043,
      name: "",
      result: "",
      toolCalls: [],
      callId: "e12e3552-df06-4254-a725-00d9c80f48a3",
    },
    // {
    //   id: crypto.randomUUID(),
    //   role: "bot" as RoleType,
    //   time: 1730766915055,
    //   source: "",
    //   endTime: 1730766918744.9998,
    //   message:
    //     "Hello. This is Mary from Mary's Dental. How can I assist you today?",
    //   duration: 3.48,
    //   secondsFromStart: 1.36,
    //   callId: call.id,
    // },
    // {
    //   id: crypto.randomUUID(),
    //   role: "user" as RoleType,
    //   time: 1730766920695,
    //   endTime: 1730766922915,
    //   message: "Uh, how how would you like to assist me to say?",
    //   duration: 2.22,
    //   secondsFromStart: 7,
    //   callId: call.id,
    // },
    // {
    //   id: crypto.randomUUID(),
    //   role: "bot" as RoleType,
    //   time: 1730766924275,
    //   source: "",
    //   endTime: 1730766930915,
    //   message:
    //     "Well, I can help you book an appointment with doctor Mary or schedule a date with Mary after hours. What can I do for you?",
    //   duration: 6.33,
    //   secondsFromStart: 10.58,
    //   callId: call.id,
    // },
    // {
    //   id: crypto.randomUUID(),
    //   role: "user" as RoleType,
    //   time: 1730766931645,
    //   endTime: 1730766934785,
    //   message: "Well, I would love to schedule a date with Mary after horrors.",
    //   duration: 3.14,
    //   secondsFromStart: 17.95,
    //   callId: call.id,
    // },
    // {
    //   id: crypto.randomUUID(),
    //   role: "bot" as RoleType,
    //   time: 1730766937035,
    //   source: "",
    //   endTime: 1730766946725,
    //   message:
    //     "Oh, going for the after hours romance, like your style ah. Let's schedule a date with Mary. What day works best for you? Friday, Saturday, or Sunday after 8 PM?",
    //   duration: 8.62,
    //   secondsFromStart: 23.34,
    //   callId: call.id,
    // },
    // {
    //   id: crypto.randomUUID(),
    //   role: "user" as RoleType,
    //   time: 1730766948085,
    //   endTime: 1730766954385,
    //   message:
    //     "Uh, how about Saturday at 8 PM at this uh, very nice French restaurant that I know downtown?",
    //   duration: 5.72,
    //   secondsFromStart: 34.39,
    //   callId: call.id,
    // },
    // {
    //   id: crypto.randomUUID(),
    //   role: "bot" as RoleType,
    //   time: 1730766955745,
    //   source: "",
    //   endTime: 1730766964135,
    //   message:
    //     "Smooth move. Unfortunately, Mary's schedule is fully booked for Saturday at 8 PM. Would you like to try for Friday or Sunday after 8 PM instead?",
    //   duration: 7.87,
    //   secondsFromStart: 42.05,
    //   callId: call.id,
    // },
    // {
    //   id: crypto.randomUUID(),
    //   role: "user" as RoleType,
    //   time: 1730766964955,
    //   endTime: 1730766966094.998,
    //   message: "Uh, Friday works.",
    //   duration: 1.139,
    //   secondsFromStart: 51.26,
    //   callId: call.id,
    // },
    // {
    //   id: crypto.randomUUID(),
    //   role: "bot" as RoleType,
    //   time: 1730766966885,
    //   source: "",
    //   endTime: 1730766975485,
    //   message:
    //     "Great choice. Friday it is. Let me confirm the details with Mary and get back to you on the exact location. Thank you for choosing Mary for your after hours date.",
    //   duration: 7.82,
    //   secondsFromStart: 53.19,
    //   callId: call.id,
    // },
    // {
    //   id: crypto.randomUUID(),
    //   role: "user" as RoleType,
    //   time: 1730766977285,
    //   endTime: 1730766977785,
    //   message: "Right.",
    //   duration: 0.5,
    //   secondsFromStart: 63.59,
    //   callId: call.id,
    // },
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
  latencyBlocks: [
    {
      id: "2aa676ab-ee93-445e-aac0-48d2ab891ab8",
      secondsFromStart: 4.02,
      duration: 2.140000000000001,
      callId: "e12e3552-df06-4254-a725-00d9c80f48a3",
    },
    {
      id: "9b9bf2e7-b88e-46c1-8a1c-4fee2c486622",
      secondsFromStart: 8.26,
      duration: 1.259999500000001,
      callId: "e12e3552-df06-4254-a725-00d9c80f48a3",
    },
    {
      id: "67b63e08-1fcd-439a-af85-e4975f9ae138",
      secondsFromStart: 20.035,
      duration: 2.149999999999999,
      callId: "e12e3552-df06-4254-a725-00d9c80f48a3",
    },
    {
      id: "f7a9a10f-9905-4067-ba24-9b6c1b38a1f6",
      secondsFromStart: 32.120003,
      duration: 1.369997000000005,
      callId: "e12e3552-df06-4254-a725-00d9c80f48a3",
    },
    {
      id: "213d2ed4-4ad4-4fd1-902a-a501cddf964e",
      secondsFromStart: 39.67,
      duration: 1.484999999999999,
      callId: "e12e3552-df06-4254-a725-00d9c80f48a3",
    },
    {
      id: "cc1866f9-9d57-4727-883d-41d9fc85ba20",
      secondsFromStart: 49.414997,
      duration: 1.030003000000001,
      callId: "e12e3552-df06-4254-a725-00d9c80f48a3",
    },
    {
      id: "5d1a89cb-bcb9-414b-b4fb-d359f4da26f8",
      secondsFromStart: 51.344997,
      duration: 0.7050059999999974,
      callId: "e12e3552-df06-4254-a725-00d9c80f48a3",
    },
    {
      id: "d8ecae09-4ec6-4c1e-9eb6-7dd4c7e0537c",
      secondsFromStart: 60.870003,
      duration: 1.704937000000001,
      callId: "e12e3552-df06-4254-a725-00d9c80f48a3",
    },
    {
      id: "ab5d3343-3ea0-4bae-ab09-6cc6ee873e83",
      secondsFromStart: 63.07494,
      duration: 0.6550630000000055,
      callId: "e12e3552-df06-4254-a725-00d9c80f48a3",
    },
  ],
  interruptions: [
    {
      id: "2aa676ab-ee93-445e-aac0-48d2ab891ab8",
      secondsFromStart: 4.02,
      duration: 2.140000000000001,
      callId: "e12e3552-df06-4254-a725-00d9c80f48a3",
    },
    {
      id: "9b9bf2e7-b88e-46c1-8a1c-4fee2c486622",
      secondsFromStart: 8.26,
      duration: 1.259999500000001,
      callId: "e12e3552-df06-4254-a725-00d9c80f48a3",
    },
    {
      id: "67b63e08-1fcd-439a-af85-e4975f9ae138",
      secondsFromStart: 20.035,
      duration: 2.149999999999999,
      callId: "e12e3552-df06-4254-a725-00d9c80f48a3",
    },
  ],
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
  // stereoRecordingUrl:
  //   "https://jtuyprjjgxbgmtjiykoa.supabase.co/storage/v1/object/public/recordings/1a9a9108-95c4-4fd9-befc-a27cfb5eff69-1730766982390-c7218bd2-42b9-47e4-9ce1-9c6dcf62e8d0-stereo.wav",
  stereoRecordingUrl: "/test_call.wav",
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
