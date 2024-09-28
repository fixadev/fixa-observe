import { z } from "zod";
import { type Survey } from "@prisma/client";


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
    buildingIds: z.array(z.string()),
    ownerId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    customProperties: z.record(z.string(), z.any()),
  } satisfies { [K in keyof Survey]: z.ZodType<Survey[K]> });

