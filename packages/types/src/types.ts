import { z } from "zod";

export type PlatformOptions = z.infer<typeof platformOptions>;
export const platformOptions = z.enum(["retell", "vapi", "bland"]);

export const transcriptionErrorSchema = z.object({
  type: z.enum(["replacement", "addition", "deletion"]),
  messageIndex: z.number(),
  wordIndexRange: z.array(z.number()),
  correctWord: z.string(),
});
export type TranscriptionError = z.infer<typeof transcriptionErrorSchema>;

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

export const EvaluationGroupFilterCondition = z.object({
  id: z.string(),
  type: z.literal("filter"),
  property: z.string(),
  value: z.string(),
});

export const EvaluationGroupTextCondition = z.object({
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
  ownerId: z.string(),
  metadata: z.record(z.string(), z.string()).optional(),
  saveRecording: z.boolean().optional(),
  language: z.string().optional(),
});

export type BlockChange = z.infer<typeof BlockChangeSchema>;
export const BlockChangeSchema = z.object({
  id: z.string(),
  type: z.enum(["latencyBlock", "interruption"]),
  secondsFromStart: z.number(),
  duration: z.number(),
});
