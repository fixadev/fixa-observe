import { z } from "zod";
import { SurveySchema } from "../../prisma/generated/zod";
import { propertySchema } from "./property";

export type CreateSurveyInput = z.infer<typeof createSurveyInput>;
export const createSurveyInput = z.object({
  projectId: z.string(),
  surveyName: z.string(),
});

export type SurveyWithProperties = z.infer<typeof surveyWithPropertiesSchema>;
export const surveyWithPropertiesSchema = SurveySchema.extend({
  properties: z.array(propertySchema),
});

export type SurveySchema = z.infer<typeof SurveySchema>;
export const surveySchema = SurveySchema;
