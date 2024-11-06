import { z } from "zod";

export type PlatformOptions = z.infer<typeof platformOptions>;
export const platformOptions = z.enum(["retell", "vapi", "bland"]);

export const callSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  recordingUrl: z.string(),
  summary: z.string(),
  originalTranscript: z.string(),
  originalMessages: z.array(
    z.object({
      role: z.enum(["system", "bot", "user"]),
      message: z.string(),
      duration: z.number().optional(),
      secondsFromStart: z.number(),
    }),
  ),
  updatedTranscript: z.string(),
  duration: z.number(),
  unread: z.boolean(),
  errors: z
    .array(
      z.object({
        start: z.number(),
        end: z.number(),
        type: z.enum(["transcription"]),
        confidence: z.number(),
      }),
    )
    .optional(),
});
export type Call = z.infer<typeof callSchema>;

export type CallError = NonNullable<Call["errors"]>[number];
