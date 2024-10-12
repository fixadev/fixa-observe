import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { openai } from "./OpenAIClient";
import { db } from "../db";

export async function extractAttributes(
  emailText: string,
  attributeIds: string[],
): Promise<Record<string, string | null>> {
  // Get attribute objects
  const attributes = await db.attribute.findMany({
    where: {
      OR: attributeIds.map((id) => ({ id })),
    },
  });

  // Create response format
  const responseFormat = z.object({
    ...Object.fromEntries(
      attributes.map((attribute) => [attribute.id, z.string().nullable()]),
    ),
    available: z.union([z.literal("Yes"), z.literal("No")]).nullable(),
  });

  const systemPrompt = [
    `You are an AI assistant that parses an email from a real estate agent who is trying to lease a property.`,
    `You will be given the contents of the email as a string, and you will need to extract information from the email.`,
    `The current date is ${new Date().toISOString().split("T")[0]}.`,
    `Return the information in JSON format with the following schema:`,
    `{
  ${attributes
    .map((attribute) => `${attribute.id}: string | null -- ${attribute.label}`)
    .join("\n  ")}
  available: "Yes" | "No" | null -- return "Yes" if 1) the property is available for lease now or sometime in the future, or 2) if other attributes about the property are provided and the property is not explicitly marked as unavailable, otherwise return "No"
}`,
  ].join("\n");

  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-2024-08-06",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: emailText },
    ],
    response_format: zodResponseFormat(responseFormat, "emailInfo"),
  });

  const emailInfo = completion.choices[0]?.message.parsed;

  if (emailInfo) {
    return emailInfo;
  }
  return {};
}
