import { z } from "zod";
import { openai } from "./OpenAIClient";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { formatAddress } from "./formatAddresses";

export type ParsedPropertyCard = z.infer<typeof parsedPropertyCardSchema>;
export const parsedPropertyCardSchema = z.object({
  // stuff that doesn't directly map to an attribute
  buildingName: z.string().nullable(),
  postalAddress: z.string(),
  suite: z.string().nullable(),

  // stuff that does map to an attribute
  propertyType: z.string().nullable(),
  listId: z.string().nullable(),
  availDate: z.string().nullable(),
  subtypeClass: z.string().nullable(),
  spaceUse: z.string().nullable(),
  leaseType: z.string().nullable(),
  propertySize: z.string(),
  availSpace: z.string(),
  subExpDate: z.string().nullable(),
  totalFloors: z.string().nullable(),
  cleanRm: z.boolean().nullable(),
  wetRm: z.boolean().nullable(),
  dhDoors: z.string().nullable(),
  glDoors: z.string().nullable(),
  clearHeight: z.string().nullable(),
  power: z.string().nullable(),
  vacantSpace: z.string().nullable(),
  leaseRate: z.string().nullable(),
  constructionStatus: z.string().nullable(),
  minDivisible: z.string().nullable(),
  maxDivisible: z.string().nullable(),
  expenses: z.string().nullable(),
  yearBuilt: z.string().nullable(),
  parkingRatio: z.string().nullable(),
  comments: z.string().nullable(),
});

export async function parsePropertyCardWithAI(text: string) {
  const systemPrompt = `
  You are an expert at parsing property cards. 
  You are given a string of text that contains a property card. 
  You need to parse the property card and return a JSON object that matches the schema.

  For the postal address:
  Ensure you include city state and zip.
  NEVER include the leading number with a period (e.g. 1. 2. 15. etc.) - this is not part of the address.

  Suite is the text that comes after the "/" if the field is Floor/Suite.

  Always omit neighborhood text such as "Mountain View - Downtown" or "San Jose - Downtown" -- these are NOT building names.

  Format the comments nicely with line breaks and the "-" character for bullet points.
  `;

  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
      response_format: zodResponseFormat(parsedPropertyCardSchema, "property"),
    });

    const propertyObj = completion.choices[0]?.message.parsed;

    const { displayAddress } = await formatAddress({
      addressString: propertyObj?.postalAddress ?? "",
      suite: propertyObj?.suite ?? "",
      buildingName: propertyObj?.buildingName ?? "",
    });

    return {
      ...propertyObj,
      divisibility:
        `${propertyObj?.minDivisible} - ${propertyObj?.maxDivisible}` ?? "",
      buildingName: undefined,
      suite: undefined,
      displayAddress,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

// const text3 = `
// 2.
// Valley Research Park
// 297 N Bernardo Avenue Mountain View, CA 94043
// Mountain View - South Middlefield
// List ID: 14539123 | 09/23/2024
// Property Type: R&D/Flex
// Suite:
// Multiple SuitesAvail Date:
// 09/20/2023
// Property Size: 55,799 sf
// Space Use:
// Flex
// Lease Rate:
// $3.24 NNN
// Const. Status: Completed
// Avail Space:
// 47,799 sf
// Expenses:
// Year Built:
// 1985
// Min Divisible: 130 sf
// Clean Rm: No
// Wet Lab: Yes
// Parking Ratio:
// Max Divisible: 47,799 sf
// DH Doors:
// Yard:
// No
// Sprinklers:
// No
// Office Space:
// GL Doors:
// Rail:
// No
// Lease Type:
// Sublease
// Clear Height:
// Sub Exp Date:
// Power:
// 4000A 480V 3P
// Owner Entity: Vanni Properties, Inc.
// Comments: Life Science Shared Lab space
// Mix of shared lab and office space. Entire building available for lease but divisible.
// Asking rates are
// based on size of tenant requirement .
// Lease Agent - Valley Research Park :: Joe Cain - 415.377.4304 - admin@valleyresearchpark.com

// `;

// async function test() {
//   const propertyObj = await parsePropertyCard(text3);
//   console.log(propertyObj);
// }

// void test();
