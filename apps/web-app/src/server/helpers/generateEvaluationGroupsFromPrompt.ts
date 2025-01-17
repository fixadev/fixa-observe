import { openai } from "~/server/utils/openAIClient";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { type EvaluationGroup } from "@repo/types/src/index";
import {
  generateCheckIfOutboundPrompt,
  generateEvaluationGroupsPrompt,
} from "./prompts";
import { db } from "../db";
import { EvaluationService } from "@repo/services/src";
import { EvalContentType, EvalResultType } from "@prisma/client";

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
  try {
    const outputSchema = z.object({
      evaluationTemplatesToCreate: z.array(
        z.object({
          name: z.string(),
          description: z.string(),
          type: z.string(),
          params: z.array(z.string()),
        }),
      ),
      evaluationGroups: z.array(
        z.object({
          name: z.string(),
          condition: z.string(),
          enabled: z.boolean(),
          evaluations: z.array(
            z.object({
              evaluationTemplateId: z.string(),
              params: z.object({}).optional(),
              evaluationTemplate: z.object({
                name: z.string(),
                description: z.string(),
                type: z.string(),
                params: z.array(z.string()),
              }),
            }),
          ),
        }),
      ),
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

    console.log("PROMPT", combinedPrompt);

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
      templates: parsedResponse.evaluationTemplatesToCreate.map((template) => ({
        ...template,
        id: "temp-1",
        params: template.params,
        createdAt: new Date(),
        ownerId: orgId,
        contentType: EvalContentType.content,
        toolCallExpectedResult: "",
        deleted: false,
        hidden: false,
      })),
      ownerId: orgId,
    });

    const createdEvaluationGroups: EvaluationGroup[] = [];

    for (const evaluationGroup of parsedResponse.evaluationGroups) {
      const createdEvaluationGroup = await db.evaluationGroup.create({
        data: {
          ...evaluationGroup,
          savedSearchId,
          ownerId: orgId,
          createdAt: new Date(),
          evaluations: {
            create: evaluationGroup.evaluations
              ?.map((evaluation) => ({
                params: evaluation.params,
                createdAt: new Date(),
                evaluationTemplate: {
                  connect: {
                    id: createdEvaluationTemplates
                      .concat(existingEvaluationTemplates)
                      .find(
                        (template) =>
                          template.name === evaluation.evaluationTemplate.name,
                      )?.id,
                  },
                },
              }))
              .filter((evaluation) => evaluation.evaluationTemplate.connect.id),
          },
        },
      });
      createdEvaluationGroups.push(createdEvaluationGroup);
    }

    return {
      evaluationGroups: createdEvaluationGroups,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
