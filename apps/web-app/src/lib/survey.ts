import { z } from "zod";
import { SurveySchema } from "../../prisma/generated/zod";

export type CreateSurveyInput = z.infer<typeof createSurveyInput>;
export const createSurveyInput = z.object({
    projectId: z.string(),
    surveyName: z.string(),
});

export type SurveySchema = z.infer<typeof SurveySchema>;
export const surveySchema = SurveySchema;