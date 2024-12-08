import { z } from "zod";
import { EvalContentType, EvalResultType, EvalType } from "@prisma/client";
import {
  EvalSchema,
  type EvalOverrideSchema,
  EvalSetSchema,
} from "prisma/generated/zod";

export type EvalSchema = z.infer<typeof EvalSchema>;

export type EvalOverrideSchema = z.infer<typeof EvalOverrideSchema>;

export type EvalSetWithIncludes = z.infer<typeof EvalSetWithIncludesSchema>;
export const EvalSetWithIncludesSchema = EvalSetSchema.extend({
  evals: z.array(EvalSchema),
});
