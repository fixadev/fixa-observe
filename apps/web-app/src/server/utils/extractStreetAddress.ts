import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { openai } from "./OpenAIClient";

export async function extractStreetAddress(address: string): Promise<string> {
  // Create response format
  const responseFormat = z.object({
    streetAddress: z.string().nullable(),
  });

  const systemPrompt = [
    `Given the following string, return the street address (e.g. 123 Main St). DO NOT INCLUDE SUITE INFO. JUST THE STREET ADDRESS`,
  ].join("\n");

  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: address },
    ],
    response_format: zodResponseFormat(responseFormat, "streetAddress"),
  });

  const result = completion.choices[0]?.message.parsed;

  if (result) {
    return result.streetAddress ?? "";
  }
  return "";
}
