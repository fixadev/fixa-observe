import { z } from "zod";
import { EvaluationGroupWithIncludesSchema } from "./db";
import { AlertWithDetailsSchema } from "./alert";

export const TimeRangeSchema = z.object({
  start: z.number(),
  end: z.number(),
});

export const EvaluationGroupResultSchema = z.object({
  id: z.string(),
  result: z.boolean().nullable(),
});

export type Filter = z.infer<typeof FilterSchema>;
export const FilterSchema = z.object({
  lookbackPeriod: z.object({
    label: z.string(),
    value: z.number(),
  }),
  timeRange: z.union([TimeRangeSchema, z.null(), z.undefined()]),
  agentId: z.array(z.string()),
  chartPeriod: z.number(),
  customerCallId: z.union([z.string(), z.null(), z.undefined()]),
  metadata: z.union([
    z.record(z.string(), z.string().or(z.array(z.string())).or(z.undefined())),
    z.null(),
    z.undefined(),
  ]),
  evaluationGroups: z.array(EvaluationGroupWithIncludesSchema).optional(),
  alerts: z.array(AlertWithDetailsSchema).optional(),
  evaluationGroupResult: z.union([
    EvaluationGroupResultSchema,
    z.null(),
    z.undefined(),
  ]),
});
