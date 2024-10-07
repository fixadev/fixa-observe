import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { type ContactSchema } from '../../lib/property';
import { pdfjs } from 'react-pdf';
import { parsePDF } from '~/app/(survey-dashboard)/projects/[projectId]/surveys/[surveyId]/_components/NDXOutputUploader';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_KEY,
});


const Contact = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  propertyId: z.string(),
})

export async function extractContactInfo(brochureUrl: string) {

  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const response = await fetch(brochureUrl);
  const file = await response.arrayBuffer();
  const fileBlob = new Blob([file], { type: 'application/pdf' });
  const pdfFile = new File([fileBlob], 'document.pdf', { type: 'application/pdf' });

  const parsedPDF = await parsePDF(pdfFile, pdfjs);
  const text = parsedPDF?.join('\n');

  if (!text) {
    throw new Error('No text found in PDF');
  }

  const systemPrompt = `
  You are an AI assistant that extracts contact information from a given brochure.
  The brochure contains information about a property for sale or rent.
  You will be given a URL to the brochure and a description of the property.
  You will need to extract the contact information from the brochure.
  The contact information will be in the form of a JSON object with the following properties:
  - firstName: string
  - lastName: string
  - email: string
  - phone: string | null

  Return the JSON object.
  `

  const msg = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: text }],
  });
  console.log('ANTHROPIC RESPONSE', msg);

  return msg.content;

}