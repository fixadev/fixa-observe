import { z } from "zod";
import { type Survey } from "@prisma/client";
import { createPropertySchema } from "./property";
import { attributeSchema } from "./property";

export type CreateSurveyInput = z.infer<typeof createSurveyInput>;
export const createSurveyInput = z.object({
    projectId: z.string(),
    surveyName: z.string(),
});

export type SurveySchema = z.infer<typeof surveySchema>;
export const surveySchema = z.object({
    id: z.string(),
    name: z.string(),
    projectId: z.string(),
    properties: z.array(createPropertySchema),
    attributesOrder: z.array(attributeSchema),
    ownerId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  } satisfies { [K in keyof Survey]: z.ZodType<Survey[K]> });

