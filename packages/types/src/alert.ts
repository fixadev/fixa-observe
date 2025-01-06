import { z } from "zod";
import { AlertSchema } from "./generated";

export type LatencyAlert = z.infer<typeof LatencyAlertSchema>;
export const LatencyAlertSchema = z.object({
  lookbackPeriod: z.object({
    label: z.string(),
    value: z.number(),
  }),
  cooldownPeriod: z.object({
    label: z.string(),
    value: z.number(),
  }),
  lastAlerted: z.string(),
  percentile: z.enum(["p50", "p90", "p95"]),
  threshold: z.number(),
  slackNames: z.array(z.string()),
});

export type EvaluationGroupAlert = z.infer<typeof EvaluationGroupAlertSchema>;
export const EvaluationGroupAlertSchema = z.object({
  evaluationGroupId: z.string(),
  trigger: z.boolean().nullable(),
  slackNames: z.array(z.string()),
});

export type AlertWithDetails = z.infer<typeof AlertWithDetailsSchema>;
export const AlertWithDetailsSchema = z.discriminatedUnion("type", [
  AlertSchema.omit({ details: true }).extend({
    type: z.literal("latency"),
    details: LatencyAlertSchema,
  }),
  AlertSchema.omit({ details: true }).extend({
    type: z.literal("evalSet"),
    details: EvaluationGroupAlertSchema,
  }),
]);

export const CreateAlertSchema = z.discriminatedUnion("type", [
  AlertSchema.omit({
    details: true,
    id: true,
    createdAt: true,
    ownerId: true,
    savedSearchId: true,
  }).extend({
    type: z.literal("latency"),
    details: LatencyAlertSchema.omit({
      slackNames: true,
    }),
  }),
  AlertSchema.omit({
    details: true,
    id: true,
    createdAt: true,
    ownerId: true,
    savedSearchId: true,
  }).extend({
    type: z.literal("evalSet"),
    details: EvaluationGroupAlertSchema.omit({
      slackNames: true,
    }),
  }),
]);

export type CreateAlert = z.infer<typeof CreateAlertSchema>;
