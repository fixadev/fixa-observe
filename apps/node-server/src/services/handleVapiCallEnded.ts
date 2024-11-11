import { CallResult, CallStatus, Role } from "@prisma/client";
import { db } from "../db";
import { type ServerMessageEndOfCallReport } from "@vapi-ai/server-sdk/api";
import { analyzeCall } from "./findLLMErrors";

const mockSystemPrompt = `
System Prompt: Drive-Through Donut Order AI Agent

Objective: Efficiently take drive-through orders for a donut shop, provide accurate responses and suggestions, answer questions, and facilitate a friendly and satisfying customer experience.

Tone and Style:

Friendly, upbeat, and conversational, creating a warm and welcoming atmosphere.
Be concise and efficient to ensure quick service without rushing the customer.
Order-Taking Process:

Greeting and Introduction:

Start with a friendly greeting and offer help, e.g., “Welcome to [Donut Shop Name]! How can I help you with your order today?”
Mention any featured or seasonal items if applicable.
Item Selection and Confirmation:

Guide the customer through their options, e.g., “Would you like to start with donuts, or are you interested in coffee or other drinks as well?”
Confirm items as they’re ordered: “Got it! One chocolate-glazed donut. Anything else?”
Ask clarifying questions if needed, e.g., “Would you like that with a hot coffee or iced?”
Suggestions and Upselling:

Offer add-ons or popular combos in a casual, non-pushy way. Example: “A lot of people love pairing that with a coffee—would you like to add one?”
Customizations and Special Requests:

If a customer asks for modifications or specific preferences, handle them as best as possible within available options.
Example: “We can warm that donut up for you if you’d like!”
Order Review and Confirmation:

Before finalizing, confirm the complete order: “So that’s a chocolate-glazed donut and a small iced coffee. Does that look correct?”
Make sure to mention the total amount and expected wait time: “Your total is $5.25. We’ll have that ready in just a moment!”
Closing and Thank-You:

Conclude with a friendly note: “Thank you for choosing [Donut Shop Name]! We’ll see you at the window!”
Behavior Guidelines:

Remain courteous and adaptable to customer needs, maintaining a calm and efficient demeanor.
If unsure about any customer request, offer available options rather than guessing.
Error Handling:

If the customer asks about unavailable items or options, respond politely: “I’m sorry, we don’t have that today. Is there something else I can get for you?”
If technical difficulties occur (e.g., audio issues), kindly request clarification: “I’m sorry, could you repeat that?”

`;

const mockUserPrompt = `
You are a customer at a drive through restaurant. You want to order a dozen donuts. make sure to ask for 6 boston creme and 6 chocolate glazed.
`;

export const handleVapiCallEnded = async (
  report: ServerMessageEndOfCallReport,
) => {
  const callId = report?.call?.id;
  if (!callId) {
    console.error("No call ID found in Vapi call ended report");
    return;
  }

  const call = await db.call.findFirst({
    where: { id: callId },
    include: { testAgent: true },
  });

  if (!call) {
    console.error("No call found in DB for call ID", callId);
    return;
  }

  const test = await db.test.findFirst({
    where: { id: call.testId },
    include: { calls: true, agent: true },
  });

  const agent = test?.agent;
  const testAgent = call?.testAgent;

  // console.log("CALL", call);

  // console.log("TEST", test);

  // console.log("AGENT", agent);

  // console.log("TEST AGENT", testAgent);

  const ownerId = agent?.ownerId;

  if (!ownerId) {
    console.error("No owner ID found for agent");
    return;
  }

  if (!agent?.systemPrompt || !testAgent?.prompt) {
    console.error("No agent or test agent prompt found");
    return;
  }

  if (!report.call || !report.artifact.messages) {
    console.error("No artifact messages found");
    return;
  }

  const { errors, success, failureReason } = await analyzeCall(
    agent.systemPrompt,
    testAgent?.prompt,
    report.call,
    report.artifact.messages,
  );

  console.log("ERRORS", errors);
  console.log("SUCCESS", success);
  console.log("FAILURE REASON", failureReason);
  console.log("MESSAGES", report.artifact.messages);

  const updatedCall = await db.call.update({
    where: { id: callId },
    data: {
      status: CallStatus.completed,
      errors: {
        create: errors,
      },
      result: success ? CallResult.success : CallResult.failure,
      failureReason,
      stereoRecordingUrl: report.artifact.stereoRecordingUrl,
      messages: {
        create: report.artifact.messages
          .map((message) => {
            const baseMessage = {
              role: message.role as Role,
              time: message.time,
              secondsFromStart: message.secondsFromStart,
            };
            return {
              ...baseMessage,
              // @ts-expect-error
              ...(message.message && { message: message.message }),
              // @ts-expect-error
              ...(message.endTime && { endTime: message.endTime }),
              // @ts-expect-error
              ...(message.duration && { duration: message.duration }),
              // @ts-expect-error
              ...(message.toolCalls && { toolCalls: message.toolCalls }),
              // @ts-expect-error
              ...(message.result && { result: message.result }),
              // @ts-expect-error
              ...(message.name && { name: message.name }),
            };
          })
          .filter((message) => message !== null),
      },
    },
  });

  return {
    ownerId,
    testId: test?.id,
    callId,
    call: updatedCall,
  };
};
