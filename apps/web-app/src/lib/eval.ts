import { z } from "zod";
import { EvalContentType, EvalResultType, EvalType } from "@prisma/client";
import {
  EvalSchema,
  type EvalOverrideSchema,
  EvalGroupSchema,
} from "prisma/generated/zod";

export type EvalSchema = z.infer<typeof EvalSchema>;

export type EvalOverrideSchema = z.infer<typeof EvalOverrideSchema>;

export const AlternateCreateEvalSchema = z.object({
  type: z.nativeEnum(EvalType),
  resultType: z.nativeEnum(EvalResultType),
  contentType: z.nativeEnum(EvalContentType),
  id: z.string(),
  createdAt: z.coerce.date(),
  name: z.string(),
  description: z.string(),
  toolCallExpectedResult: z.string(),
  scenarioId: z.string().nullable(),
  agentId: z.string().nullable(),
  ownerId: z.string().nullable(),
  isCritical: z.boolean(),
  deleted: z.boolean(),
  evalGroupId: z.string().nullable(),
});

export type EvalGroupWithEvals = z.infer<typeof EvalGroupWithEvals>;
export const EvalGroupWithEvals = EvalGroupSchema.extend({
  evals: z.array(EvalSchema),
});
