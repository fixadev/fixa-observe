// import type { Intent, RoleType, TestAgent } from "prisma/generated/zod";
// import type {
//   TestWithIncludes,
//   CallWithIncludes,
//   AgentWithIncludes,
// } from "./types";

// export const TEST_TEST_AGENTS: TestAgent[] = [
//   {
//     id: "1",
//     ownerId: null,
//     name: "steve",
//     headshotUrl: "/images/agent-avatars/steve.jpeg",
//     description: "angry man who had a bad day",
//     prompt: "Test prompt",
//   },
//   {
//     id: "3",
//     ownerId: null,
//     name: "lily",
//     headshotUrl: "/images/agent-avatars/lily.jpeg",
//     description: "young woman who says 'like' a lot",
//     prompt: "Test prompt",
//   },
//   {
//     id: "2",
//     ownerId: null,
//     name: "marge",
//     headshotUrl: "/images/agent-avatars/marge.jpeg",
//     description: "old lady with a temper",
//     prompt: "Test prompt",
//   },
// ];

// export const TEST_AGENT: AgentWithIncludes = {
//   id: "1",
//   ownerId: "1",
//   createdAt: new Date(),
//   updatedAt: new Date(),
//   intents: [
//     {
//       id: "1",
//       name: "make reservation",
//       instructions:
//         "Help the customer place a food order. Get specific items, quantities, any special requests or dietary restrictions.",
//       successCriteria: "Order was placed successfully",
//       agentId: "1",
//     },
//     {
//       id: "2",
//       name: "order takeout",
//       instructions:
//         "Help the customer place a food order. Get specific items, quantities, any special requests or dietary restrictions.",
//       successCriteria: "Order was placed successfully",
//       agentId: "1",
//     },
//     {
//       id: "3",
//       name: "ask about menu",
//       instructions:
//         "Help the customer place a food order. Get specific items, quantities, any special requests or dietary restrictions.",
//       successCriteria: "Order was placed successfully",
//       agentId: "1",
//     },
//   ],
//   name: "Test Agent",
//   phoneNumber: "+1 (234) 567-8901",
//   githubRepoUrl: "https://github.com/pixa-dev/pixa-drive-thru",
//   systemPrompt: "Test system prompt",
//   enabledTestAgents: [TEST_TEST_AGENTS[0]!, TEST_TEST_AGENTS[1]!],
// };

// export const TEST_INTENTS: Intent[] = [
//   {
//     id: "2",
//     name: "make reservation",
//     instructions:
//       "Assist in making a restaurant reservation. Collect date, time, party size, and any special accommodations needed.",
//     successCriteria: "Reservation was made successfully",
//     agentId: "test-agent-1",
//   },
//   {
//     id: "1",
//     name: "order takeout",
//     instructions:
//       "Help the customer place a food order. Get specific items, quantities, any special requests or dietary restrictions.",
//     successCriteria: "Order was placed successfully",
//     agentId: "test-agent-1",
//   },
//   {
//     id: "3",
//     name: "ask about menu",
//     instructions:
//       "Answer general questions about the restaurant including hours, location, menu items, or policies.",
//     successCriteria: "Reservation was made successfully",
//     agentId: "test-agent-1",
//   },
// ];

// export const TEST_CALLS: CallWithIncludes[] = [
//   {
//     id: crypto.randomUUID(),
//     status: "completed" as const,
//     result: "success" as const,
//     failureReason: null,
//     testId: "1",
//     intentId: TEST_INTENTS[0]!.id,
//     intent: TEST_INTENTS[0]!,
//   },
//   {
//     id: crypto.randomUUID(),
//     status: "completed" as const,
//     result: "failure" as const,
//     failureReason: null,
//     testId: "1",
//     intentId: TEST_INTENTS[1]!.id,
//     intent: TEST_INTENTS[1]!,
//   },
//   {
//     id: crypto.randomUUID(),
//     status: "completed" as const,
//     result: "success" as const,
//     failureReason: "Technical difficulties during call",
//     testId: "1",
//     intentId: TEST_INTENTS[2]!.id,
//     intent: TEST_INTENTS[2]!,
//   },
//   {
//     id: crypto.randomUUID(),
//     status: "completed" as const,
//     result: "success" as const,
//     failureReason: null,
//     testId: "1",
//     intentId: TEST_INTENTS[0]!.id,
//     intent: TEST_INTENTS[0]!,
//   },
//   {
//     id: crypto.randomUUID(),
//     status: "completed" as const,
//     result: "failure" as const,
//     failureReason: "Call disconnected",
//     testId: "1",
//     intentId: TEST_INTENTS[1]!.id,
//     intent: TEST_INTENTS[1]!,
//   },
//   {
//     id: crypto.randomUUID(),
//     status: "completed" as const,
//     result: "success" as const,
//     failureReason: null,
//     testId: "1",
//     intentId: TEST_INTENTS[0]!.id,
//     intent: TEST_INTENTS[0]!,
//   },
//   {
//     id: crypto.randomUUID(),
//     status: "completed" as const,
//     result: "failure" as const,
//     failureReason: "System error during payment",
//     testId: "1",
//     intentId: TEST_INTENTS[2]!.id,
//     intent: TEST_INTENTS[2]!,
//   },
//   {
//     id: crypto.randomUUID(),
//     status: "completed" as const,
//     result: "success" as const,
//     failureReason: null,
//     testId: "1",
//     intentId: TEST_INTENTS[0]!.id,
//     intent: TEST_INTENTS[0]!,
//   },
//   {
//     id: crypto.randomUUID(),
//     status: "completed" as const,
//     result: "failure" as const,
//     failureReason: "Audio quality issues",
//     testId: "1",
//     intentId: TEST_INTENTS[1]!.id,
//     intent: TEST_INTENTS[1]!,
//   },
//   {
//     id: crypto.randomUUID(),
//     status: "completed" as const,
//     result: "success" as const,
//     failureReason: null,
//     testId: "1",
//     intentId: TEST_INTENTS[0]!.id,
//     intent: TEST_INTENTS[0]!,
//   },
// ].map((call, index) => ({
//   ...call,
//   startedAt: new Date(Date.now() - index * 10000).toISOString(),
//   endedAt: new Date(
//     Date.now() - index * 10000 + (Math.floor(Math.random() * 120000) + 60000),
//   ).toISOString(),
//   ownerId: null,
//   duration: Math.floor(Math.random() * (600 - 60 + 1)) + 60,
//   unread: index === 0,
//   node: ["1", "2", "3", "4", "4a", "4b"][index % 6]!,
//   testAgentId: (index % 3).toString(),
//   testAgent: TEST_TEST_AGENTS[index % 3]!,
//   messages: [
//     {
//       role: "user" as RoleType,
//       time: 1731547278525,
//       source: "",
//       endTime: 1731547282705,
//       message: "Hey there. Mario's Pizza. How can I help you today?",
//       duration: 3475.000244140625,
//       secondsFromStart: 0,
//     },
//     {
//       role: "bot" as RoleType,
//       time: 1731547284025,
//       endTime: 1731547287255.0005,
//       message: "If I could, like, order a pizza, that'd be, like, amazing.",
//       duration: 2920.00048828125,
//       secondsFromStart: 5.5,
//     },
//     {
//       role: "user" as RoleType,
//       time: 1731547288124.999,
//       source: "",
//       endTime: 1731547291635,
//       message: "Got it. 1 pizza. Would you like any sides with that?",
//       duration: 3120 + 1.675,
//       secondsFromStart: 9.599999 - 1.675,
//     },
//     {
//       role: "bot" as RoleType,
//       time: 1731547293074.999,
//       endTime: 1731547298005,
//       message:
//         "Uh, Yeah. Because I can look 2 orders of those garlic knots? They're, like, so good.",
//       duration: 4330.0009765625,
//       secondsFromStart: 14.549999,
//     },
//     {
//       role: "user" as RoleType,
//       time: 1731547298634.999,
//       source: "",
//       endTime: 1731547309035,
//       message:
//         "Alright. So that's a pizza and 2 orders of garlic knots. Your total comes to 28 dollars and 97 cents. It'll be ready for pickup in about 25 minutes. Dot, does that work for you?",
//       duration: 9790.0009765625,
//       secondsFromStart: 20.109999,
//     },
//     {
//       role: "bot" as RoleType,
//       time: 1731547309995,
//       endTime: 1731547312095,
//       message: "That's, like, perfect timing, actually.",
//       duration: 2100,
//       secondsFromStart: 31.47,
//     },
//     {
//       role: "user" as RoleType,
//       time: 1731547312875,
//       source: "",
//       endTime: 1731547315175,
//       message: "Great. Can I get a name for the order?",
//       duration: 1970,
//       secondsFromStart: 34.35,
//     },
//     {
//       role: "bot" as RoleType,
//       time: 1731547315475,
//       endTime: 1731547316455,
//       message: "It's Lily.",
//       duration: 980,
//       secondsFromStart: 36.95,
//     },
//     {
//       role: "user" as RoleType,
//       time: 1731547317255.003,
//       source: "",
//       endTime: 1731547322535,
//       message:
//         "Perfect. Your order will be ready for pickup in 25 minutes under the name Lily. See you soon.",
//       duration: 4600,
//       secondsFromStart: 38.730003,
//     },
//   ].map((message) => ({
//     ...message,
//     id: crypto.randomUUID(),
//     name: "test-agent-1",
//     result: call.result,
//     toolCalls: [],
//     callId: call.id,
//   })),
//   errors:
//     call.result !== "success"
//       ? [
//           {
//             id: crypto.randomUUID(),
//             secondsFromStart: 9.599999 - 1.675,
//             duration: 3.12 + 1.675,
//             type: "missing_information",
//             description:
//               "agent failed to ask customer what type of pizza they wanted",
//             callId: call.id,
//           },
//         ]
//       : [],
//   stereoRecordingUrl:
//     "https://jtuyprjjgxbgmtjiykoa.supabase.co/storage/v1/object/public/recordings/52d458bc-1a46-4daa-9678-55123364a468-1731547327741-79ac2ff8-1cf9-4247-a05c-e9b23b615c91-stereo.wav",
// }));

// export const TEST_TESTS: TestWithIncludes[] = [
//   {
//     id: "1",
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     agentId: "test-agent-1",
//     calls: TEST_CALLS,
//     gitBranch: null,
//     gitCommit: null,
//   },
// ];
