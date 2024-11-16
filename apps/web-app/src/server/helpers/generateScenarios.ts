import { openai } from "~/server/utils/OpenAIClient";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { CreateScenarioSchema } from "~/lib/agent";
import {
  generateOutboundScenariosPrompt,
  generateInboundScenariosPrompt,
  generateCheckIfOutboundPrompt,
} from "./prompts";

export const generateScenariosFromPrompt = async (
  prompt: string,
  numberOfScenarios: number,
): Promise<CreateScenarioSchema[]> => {
  const outputSchema = z.object({
    scenarios: z.array(CreateScenarioSchema),
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
      ? generateOutboundScenariosPrompt(numberOfScenarios)
      : generateInboundScenariosPrompt(numberOfScenarios)
  }\n\n AGENT PROMPT: ${prompt}
  \n\nmake sure to set the isNew field to false for all scenarios
  \n\nmake sure to generate ${numberOfScenarios} scenarios`;

  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o",
    messages: [{ role: "system", content: combinedPrompt }],
    response_format: zodResponseFormat(outputSchema, "scenarios"),
  });

  const parsedResponse = completion.choices[0]?.message.parsed;

  if (!parsedResponse) {
    throw new Error("No response from OpenAI");
  }

  console.log("parsedResponse", parsedResponse);

  return parsedResponse.scenarios;
};
