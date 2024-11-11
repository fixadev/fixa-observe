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
  failureReason: z.string(),
});

export const analyzeCall = async (
  agentPrompt: string,
  testAgentPrompt: string,
  call: Call,
  messages: ArtifactMessagesItem[],
): Promise<CallResult> => {
  const basePrompt = `
  Your job to to analyze a call transcript and determine where the assistant made errors, and what those errors were, if any.
  
  You will be provided the following information:
  - The assistant agent's prompt
  - The user agent's prompt / intent
  - The call transcript. In this, the assistant being tested will be labeled as "user" and the test agent will be labeled as "bot".

  You will output a JSON object with the following fields:
  - success: A boolean indicating if the call was successful
  - failureReason: A short sentence describing the primary failure reason, if any
  - errors: An array of objects, each representing an error. Each error object will have the following fields:
    - type: A string describing the type of error
    - description: A string describing the error
    - secondsFromStart: The start time of the error in seconds (use the secondsFromStart for this)
    - duration: The duration of the error in seconds (use duration for this)


    OUTPUT ONLY THE JSON - do not include backticks like \`\`\`json or any other formatting
  `;

  const prompt = `${basePrompt}\n\nAssistant Agent Prompt: ${agentPrompt}\n\nUser Agent Prompt: ${testAgentPrompt}\n\nCall Transcript: ${JSON.stringify(
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

  console.log("Completion result:", result);

  const cleanedResult = result
    ?.replace("```json\n", "")
    .replace("\n```", "")
    .trim();

  console.log("Cleaned result:", cleanedResult);

  if (!cleanedResult) {
    throw new Error("No result from LLM");
  }

  const jsonResult = JSON.parse(cleanedResult);

  console.log("JSON result:", jsonResult);

  const parsedResponse = outputSchema.parse(jsonResult);

  console.log("Parsed response:", parsedResponse);

  return {
    errors: parsedResponse.errors,
    success: parsedResponse.success,
    failureReason: parsedResponse.failureReason,
  };
};
