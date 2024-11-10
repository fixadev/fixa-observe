import { openai } from "../utils/OpenAIClient";
import { VertexAI, type Part } from "@google-cloud/vertexai";
import { Storage } from "@google-cloud/storage";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { ArtifactMessagesItem, Call } from "@vapi-ai/server-sdk/api";

type CallResult = {
  errors: {
    type: string;
    description: string;
    start: string;
    end: string;
  }[];
  result: boolean;
  failureReason: string;
};

const outputSchema = z.object({
  errors: z.array(
    z.object({
      type: z.string(),
      description: z.string(),
      start: z.string(),
      end: z.string(),
    }),
  ),
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
  - The call transcript

  You will output a JSON object with the following fields:
  - result: A boolean indicating if the call was successful
  - failureReason: A short sentence describing the primary failure reason, if any
  - errors: An array of objects, each representing an error. Each error object will have the following fields:
    - type: A string describing the type of error
    - description: A string describing the error
    - start: The start time of the error
    - end: The end time of the error
  `;

  const prompt = `${basePrompt}\n\nAssistant Agent Prompt: ${agentPrompt}\n\nUser Agent Prompt: ${testAgentPrompt}\n\nCall Transcript: ${JSON.stringify(
    messages,
  )}`;

  const response = await openai.beta.chat.completions.parse({
    model: "gpt-4o",
    messages: [{ role: "system", content: prompt }],
    response_format: zodResponseFormat(outputSchema, "prompt"),
  });

  const parsedResponse = response.choices[0]?.message.parsed;

  if (!parsedResponse) {
    throw new Error("No response from OpenAI");
  }

  return {
    errors: parsedResponse.errors,
    result: parsedResponse.errors.length === 0,
    failureReason: parsedResponse.errors[0].description,
  };
};
