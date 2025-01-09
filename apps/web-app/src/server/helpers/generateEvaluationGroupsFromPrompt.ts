import { openai } from "~/server/utils/openAIClient";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import {
  type EvaluationGroup,
  EvaluationGroupWithIncludesSchema,
  EvaluationTemplateSchema,
} from "@repo/types/src/index";
import {
  generateCheckIfOutboundPrompt,
  generateEvaluationGroupsPrompt,
} from "./prompts";
import { db } from "../db";
import { EvaluationService } from "@repo/services/src";

const evaluationService = new EvaluationService(db);

const figureOutIfOutbound = async (prompt: string) => {
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

  return outboundCompletion.choices[0]?.message.parsed?.isOutbound;
};

export const createEvaluationGroupsFromPrompt = async ({
  prompt,
  count,
  orgId,
  savedSearchId,
}: {
  prompt: string;
  count: number;
  orgId: string;
  savedSearchId: string;
}): Promise<{ evaluationGroups: EvaluationGroup[] }> => {
  const outputSchema = z.object({
    evaluationTemplatesToCreate: z.array(EvaluationTemplateSchema),
    evaluationGroups: z.array(EvaluationGroupWithIncludesSchema),
  });

  const existingEvaluationTemplates = await evaluationService.getTemplates({
    ownerId: orgId,
  });

  const combinedPrompt = `${generateEvaluationGroupsPrompt(
    count,
    existingEvaluationTemplates,
  )}\n\n AGENT PROMPT: ${prompt}
  \n\nmake sure to generate ${count} evaluation groups
  \n\nmake the evaluations granular and precise
  \n\ngenerate at least 3 evaluations for each scenario`;

  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o",
    messages: [{ role: "system", content: combinedPrompt }],
    response_format: zodResponseFormat(outputSchema, "evaluationGroups"),
  });

  const parsedResponse = completion.choices[0]?.message.parsed;

  if (!parsedResponse) {
    throw new Error("No response from OpenAI");
  }
  const createdEvaluationTemplates = await evaluationService.createTemplates({
    templates: parsedResponse.evaluationTemplatesToCreate,
    ownerId: orgId,
  });

  const createdEvaluationGroups: EvaluationGroup[] = [];

  for (const evaluationGroup of parsedResponse.evaluationGroups) {
    const createdEvaluationGroup = await evaluationService.createGroup({
      group: {
        ...evaluationGroup,
        evaluations: evaluationGroup.evaluations
          .map((evaluation) => ({
            ...evaluation,
            evaluationTemplateId:
              createdEvaluationTemplates.find(
                (template) =>
                  template.name === evaluation.evaluationTemplate.name,
              )?.id ?? null,
          }))
          .filter(
            (
              evaluation,
            ): evaluation is typeof evaluation & {
              evaluationTemplateId: string;
            } =>
              evaluation.evaluationTemplateId !== null &&
              evaluation.evaluationTemplateId !== undefined,
          ),
      },
      ownerId: orgId,
    });
    createdEvaluationGroups.push(createdEvaluationGroup);
  }

  return {
    evaluationGroups: createdEvaluationGroups,
  };
};
