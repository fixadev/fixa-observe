import { z } from "zod";


export type CreateSurveyInput = z.infer<typeof createSurveyInput>;
export const createSurveyInput = z.object({
    projectId: z.string(),
    surveyName: z.string(),
});

