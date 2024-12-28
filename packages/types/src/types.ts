import { type Prisma } from "@prisma/client";
import { z } from "zod";
import { AlertWithDetailsSchema } from "./alert";
import { EvaluationGroupWithIncludesSchema } from "./eval";
import { EvaluationSchema, EvaluationTemplateSchema } from "./generated";

export type PlatformOptions = z.infer<typeof platformOptions>;
export const platformOptions = z.enum(["retell", "vapi", "bland"]);

export const transcriptionErrorSchema = z.object({
  type: z.enum(["replacement", "addition", "deletion"]),
  messageIndex: z.number(),
  wordIndexRange: z.array(z.number()),
  correctWord: z.string(),
});
export type TranscriptionError = z.infer<typeof transcriptionErrorSchema>;

export const TimeRangeSchema = z.object({
  start: z.number(),
  end: z.number(),
});

export const evalSetToSuccess = z.object({
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
  evalSets: z.array(EvaluationGroupWithIncludesSchema).optional(),
  alerts: z.array(AlertWithDetailsSchema).optional(),
  evalSetToSuccess: z.union([evalSetToSuccess, z.null(), z.undefined()]),
});

export type SelectItem = {
  label: string;
  value: number;
};

export type OrderBy = z.infer<typeof OrderBySchema>;
export const OrderBySchema = z.object({
  property: z.string(),
  direction: z.enum(["asc", "desc"]),
});

export type ExtraProperties = z.infer<typeof ExtraPropertiesSchema>;
export const ExtraPropertiesSchema = z
  .object({
    type: z.enum(["ofone-kiosk"]),
  })
  .catchall(z.any());

export type OfOneKioskProperties = z.infer<typeof OfOneKioskPropertiesSchema>;
export const OfOneKioskPropertiesSchema = ExtraPropertiesSchema.extend({
  type: z.literal("ofone-kiosk"),
  deviceIds: z.array(z.string()),
  baseUrl: z.string(),
});

export const EvalGroupFilterCondition = z.object({
  id: z.string(),
  type: z.literal("filter"),
  property: z.string(),
  value: z.string(),
});

export const EvalGroupTextCondition = z.object({
  id: z.string(),
  type: z.literal("text"),
  text: z.string(),
});

export type UploadCallParams = z.infer<typeof UploadCallParams>;
export const UploadCallParams = z.object({
  callId: z.string(),
  stereoRecordingUrl: z.string(),
  agentId: z.string(),
  createdAt: z.string().optional(),
  userId: z.string(),
  metadata: z.record(z.string(), z.string()).optional(),
  saveRecording: z.boolean().optional(),
  language: z.string().optional(),
});
