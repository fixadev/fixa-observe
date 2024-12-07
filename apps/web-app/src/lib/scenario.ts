import { z } from "zod";
import { ScenarioSchema } from "prisma/generated/zod";
import {
  CreateEvalOverrideSchema,
  CreateEvalSchema,
  EvalOverrideWithoutScenarioId,
  EvalWithoutScenarioId,
  updateEvalsSchema,
  UpdateOverridesSchema,
} from "./eval";

export type ScenarioWithEvals = z.infer<typeof ScenarioWithEvals>;
export const ScenarioWithEvals = ScenarioSchema.extend({
  evals: z.array(EvalWithoutScenarioId),
  generalEvalOverrides: z.array(EvalOverrideWithoutScenarioId),
});

export type UpdateScenarioSchema = z.infer<typeof UpdateScenarioSchema>;
export const UpdateScenarioSchema = ScenarioSchema.extend({
  evals: updateEvalsSchema,
  generalEvalOverrides: UpdateOverridesSchema,
});

export type CreateScenarioSchema = z.infer<typeof CreateScenarioSchema>;
export const CreateScenarioSchema = ScenarioSchema.omit({
  id: true,
  agentId: true,
  createdAt: true,
}).extend({
  evals: z.array(CreateEvalSchema),
  generalEvalOverrides: z.array(CreateEvalOverrideSchema),
});
