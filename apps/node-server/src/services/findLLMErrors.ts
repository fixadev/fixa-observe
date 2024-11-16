import { openai } from "../utils/OpenAIClient";
import { z } from "zod";
import { ArtifactMessagesItem, Call } from "@vapi-ai/server-sdk/api";

type CallResult = {
  errors: {
    type: string;
    description: string;
    secondsFromStart: number;
    duration: number;
  }[];
  success: boolean;
  failureReason: string;
};

const outputSchema = z.object({
  errors: z.array(
    z.object({
      type: z.string(),
      description: z.string(),
      secondsFromStart: z.number(),
      duration: z.number(),
    }),
  ),
  success: z.boolean(),
  failureReason: z.string().nullable(),
});

export const analyzeCallWitho1 = async (
  agentPrompt: string,
  testAgentPrompt: string,
  successCriteria: string,
  messages: ArtifactMessagesItem[],
): Promise<CallResult> => {
  const basePrompt = `
  Your job to to analyze a call transcript between an AI agent (the main agent) and a test AI agent (the test agent), and determine where the main agent made errors, and what those errors were, if any.

  Some main agents will be outbound agents (i.e. an agent that makes a sale to a human), and some will be inbound agents (i.e. an agent that answers questions about a product or service or helps a human book an appointment).

  You will be provided the following information:
  - The main agent's prompt
  - The test agent's prompt / scenario
  - The success criteria for the call
  - The call transcript. In this, the main agent will be labeled as "user" and the test agent will be labeled as "bot".

  You will output a JSON object with the following fields:
  - success: A boolean indicating if the call was successful. The call is successful if the main agent achieves the success criteria.
  - failureReason: A short sentence CONCISELY describing the primary failure reason, if any -- else return null
  - errors: An array of objects, each representing an error that the main agent made. Each error object will have the following fields:
    - type: A string describing the type of error
    - description: A string describing the error - refer to the main agent only as "agent"
    - secondsFromStart: The start time of the error in seconds (use the secondsFromStart for this)
    - duration: The duration of the error in seconds (use duration for this)

  OUTPUT ONLY THE JSON - do not include backticks like \`\`\`json or any other formatting

  Keep the following in mind:
  - secondsFromStart and duration should only encompass the specific portion of the call where the error occurred. It should not be very long (10 seconds is a good max), unless it makes sense for it to be longer.
  - errors should not overlap.
  - flag an error if the main agent repeats the same phrase multiple times in a row, even though it doesn't make sense for the main agent to do so.
  - any tool call messages you see are being made by the test agent, not the main agent. so if they are made erroneously, that's not an error (it is an error in the test agent, not the main agent)
  `;

  const prompt = `${basePrompt}\n\nMain Agent Prompt: ${agentPrompt}\n\nTest Agent Prompt: ${testAgentPrompt}\n\nSuccess Criteria: ${successCriteria}\n\nCall Transcript: ${JSON.stringify(
    messages,
  )}`;

  const completion = await openai.chat.completions.create({
    model: "o1-preview",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const result = completion.choices[0].message.content;

  const cleanedResult = result
    ?.replace("```json\n", "")
    .replace("\n```", "")
    .trim();

  if (!cleanedResult) {
    throw new Error("No result from LLM");
  }

  const jsonResult = JSON.parse(cleanedResult);

  const parsedResponse = outputSchema.parse(jsonResult);

  return {
    errors: parsedResponse.errors,
    success: parsedResponse.success,
    failureReason: parsedResponse.failureReason ?? "",
  };
};
