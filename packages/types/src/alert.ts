import { z } from "zod";

export type LatencyAlert = z.infer<typeof LatencyAlertSchema>;
export const LatencyAlertSchema = z.object({
  lookbackPeriod: z.number(),
  threshold: z.number(),
});

export type EvalGroupAlert = z.infer<typeof EvalGroupAlertSchema>;
export const EvalGroupAlertSchema = z.object({
  evalSetId: z.string(),
  trigger: z.boolean(),
});
