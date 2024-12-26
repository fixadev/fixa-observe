import { z } from "zod";
import {
  EvaluationSchema,
  EvaluationGroupSchema,
  EvaluationTemplateSchema,
} from "./generated";

export type EvaluationGroupWithIncludes = z.infer<
  typeof EvaluationGroupWithIncludesSchema
>;
export const EvaluationGroupWithIncludesSchema = EvaluationGroupSchema.extend({
  evaluations: z.array(
    EvaluationSchema.extend({
      evaluationTemplate: EvaluationTemplateSchema,
    }),
  ),
});
