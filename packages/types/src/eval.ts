import { z } from "zod";
import { EvalSchema, EvalSetSchema } from "./generated";

export type EvalSetWithIncludes = z.infer<typeof EvalSetWithIncludesSchema>;
export const EvalSetWithIncludesSchema = EvalSetSchema.extend({
  evals: z.array(EvalSchema),
});
