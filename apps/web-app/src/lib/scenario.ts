import { z } from "zod";
import {
  EvalOverrideSchema,
  EvalSchema,
  ScenarioSchema,
} from "prisma/generated/zod";

export type ScenarioWithEvals = z.infer<typeof ScenarioWithEvals>;
export const ScenarioWithEvals = ScenarioSchema.extend({
  evals: z.array(EvalSchema),
  generalEvalOverrides: z.array(EvalOverrideSchema),
});

export type UpdateScenarioSchema = z.infer<typeof UpdateScenarioSchema>;
export const UpdateScenarioSchema = ScenarioSchema.extend({
  evals: z.array(EvalSchema),
  generalEvalOverrides: z.array(EvalOverrideSchema),
});

export type CreateScenarioSchema = z.infer<typeof CreateScenarioSchema>;
export const CreateScenarioSchema = ScenarioSchema.omit({
  id: true,
  agentId: true,
  createdAt: true,
}).extend({
  evals: z.array(EvalSchema),
  generalEvalOverrides: z.array(EvalOverrideSchema),
});
