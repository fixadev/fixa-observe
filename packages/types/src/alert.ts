import { z } from "zod";
import { AlertSchema } from "./generated";

export type LatencyAlert = z.infer<typeof LatencyAlertSchema>;
export const LatencyAlertSchema = z.object({
  lookbackPeriod: z.object({
    label: z.string(),
    value: z.number(),
  }),
  percentile: z.enum(["p50", "p90", "p95"]),
  threshold: z.number(),
  slackNames: z.array(z.string()),
});

export type EvalSetAlert = z.infer<typeof EvalSetAlertSchema>;
export const EvalSetAlertSchema = z.object({
  evalSetId: z.string(),
  trigger: z.boolean(),
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
    details: EvalSetAlertSchema,
  }),
]);
