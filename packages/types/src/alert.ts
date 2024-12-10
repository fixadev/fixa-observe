import { z } from "zod";

export type LatencyAlert = z.infer<typeof LatencyAlertSchema>;
export const LatencyAlertSchema = z.object({
  lookbackPeriod: z.object({
    label: z.string(),
    value: z.number(),
  }),
  percentile: z.enum(["p50", "p90", "p95"]),
  threshold: z.number(),
});

export type EvalSetAlert = z.infer<typeof EvalSetAlertSchema>;
export const EvalSetAlertSchema = z.object({
  evalSetId: z.string(),
  trigger: z.boolean(),
});
