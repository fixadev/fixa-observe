import { z } from "zod";
import { EvaluationSchema, EvaluationGroupSchema } from "./generated";

export type EvalSetWithIncludes = z.infer<typeof EvalSetWithIncludesSchema>;
export const EvalSetWithIncludesSchema = EvaluationGroupSchema.extend({
  evals: z.array(EvaluationSchema),
});
