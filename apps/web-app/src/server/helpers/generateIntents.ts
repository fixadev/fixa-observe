import { openai } from "~/server/utils/OpenAIClient";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { IntentSchemaWithoutId, type IntentWithoutId } from "~/lib/agent";
import {
  generateOutboundIntentsPrompt,
  generateInboundIntentsPrompt,
  generateCheckIfOutboundPrompt,
} from "./prompts";

export const generateIntentsFromPrompt = async (
  prompt: string,
  numberOfIntents: number,
): Promise<IntentWithoutId[]> => {
  const outputSchema = z.object({
    intents: z.array(IntentSchemaWithoutId),
  });

  const outboundSchema = z.object({
    isOutbound: z.boolean(),
  });

  const outboundCompletion = await openai.beta.chat.completions.parse({
    model: "gpt-4o",
    messages: [
      { role: "system", content: generateCheckIfOutboundPrompt(prompt) },
    ],
    response_format: zodResponseFormat(outboundSchema, "isOutbound"),
  });

  const outboundResult =
    outboundCompletion.choices[0]?.message.parsed?.isOutbound;

  console.log("outboundResult", outboundResult);

  const combinedPrompt = `${
    outboundResult
      ? generateOutboundIntentsPrompt(numberOfIntents)
      : generateInboundIntentsPrompt(numberOfIntents)
  }\n\n AGENT PROMPT: ${prompt}
  \n\nmake sure to set the isNew field to false for all intents
  \n\nmake sure to generate ${numberOfIntents} intents`;

  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o",
    messages: [{ role: "system", content: combinedPrompt }],
    response_format: zodResponseFormat(outputSchema, "intents"),
  });

  const parsedResponse = completion.choices[0]?.message.parsed;

  if (!parsedResponse) {
    throw new Error("No response from OpenAI");
  }

  console.log("parsedResponse", parsedResponse);

  return parsedResponse.intents;
};
