import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { openai } from "./OpenAIClient";

const EmailInfo = z.object({
  askingRate: z.string().nullable(),
  opEx: z.string().nullable(),
  dateAvailable: z.string().nullable(),
});

export async function extractAttributes(
  emailText: string,
): Promise<Record<string, string | null>> {
  const systemPrompt = `
  You are an AI assistant that parses an email from a real estate agent who is trying to lease a property.
  You will be given a string of the email content.
  You will need to extract the price, opex, and date available for the property.
  The current date is ${new Date().toISOString().split("T")[0]}.
  Return the information in JSON format with the following schema:
  {
    askingRate: string | null -- the asking rate per square foot in dollars - ex, $5.50
    opEx: string | null -- the operating expenses per square foot in dollars - ex, $0.50
    dateAvailable: string | null -- the date the property is available in the format of "yyyy-mm-dd" - ex, "2024-11-10"
  }
  `;

  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-2024-08-06",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: emailText },
    ],
    response_format: zodResponseFormat(EmailInfo, "emailInfo"),
  });

  const emailInfo = completion.choices[0]?.message.parsed;

  if (emailInfo) {
    return emailInfo;
  }
  return {};
}
