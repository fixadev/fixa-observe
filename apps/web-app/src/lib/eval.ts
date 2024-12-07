import { z } from "zod";
import { EvalContentType, EvalResultType, EvalType } from "@prisma/client";
import {
  EvalSchema,
  EvalOverrideSchema,
  EvalGroupSchema,
} from "prisma/generated/zod";

export type EvalSchema = z.infer<typeof EvalSchema>;

export type EvalWithoutScenarioId = z.infer<typeof EvalWithoutScenarioId>;
export const EvalWithoutScenarioId = EvalSchema.omit({ scenarioId: true });

export type EvalOverrideWithoutScenarioId = z.infer<
  typeof EvalOverrideWithoutScenarioId
>;
export const EvalOverrideWithoutScenarioId = EvalOverrideSchema.omit({
  scenarioId: true,
});

export const CreateEvalSchema = EvalSchema.omit({
  createdAt: true,
  scenarioId: true,
});

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

export type CreateGeneralEvalSchema = z.infer<typeof CreateGeneralEvalSchema>;
export const CreateGeneralEvalSchema = CreateEvalSchema.omit({
  agentId: true,
  ownerId: true,
});

export type UpdateEvalsSchema = z.infer<typeof updateEvalsSchema>;
export const updateEvalsSchema = z.array(
  z.union([EvalWithoutScenarioId, CreateEvalSchema]),
);

export type CreateEvalOverrideSchema = z.infer<typeof CreateEvalOverrideSchema>;
export const CreateEvalOverrideSchema = EvalOverrideSchema.omit({
  id: true,
  scenarioId: true,
});

export type UpdateOverridesSchema = z.infer<typeof UpdateOverridesSchema>;
export const UpdateOverridesSchema = z.array(
  z.union([CreateEvalOverrideSchema, EvalOverrideWithoutScenarioId]),
);

export type EvalGroupWithEvals = z.infer<typeof EvalGroupWithEvals>;
export const EvalGroupWithEvals = EvalGroupSchema.extend({
  evals: z.array(z.union([CreateEvalSchema, EvalWithoutScenarioId])),
});
