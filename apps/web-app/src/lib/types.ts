import { z } from "zod";

export type PlatformOptions = z.infer<typeof platformOptions>;
export const platformOptions = z.enum(["retell", "vapi", "bland"]);

export const callStatusSchema = z.enum(["error", "no-errors"]);
export type CallStatus = z.infer<typeof callStatusSchema>;

export const callSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  status: callStatusSchema,
  recordingUrl: z.string(),
  summary: z.string(),
  originalTranscript: z.string(),
  originalMessages: z.array(
    z.object({
      role: z.enum(["system", "bot", "user"]),
      message: z.string(),
      duration: z.number(),
      secondsFromStart: z.number(),
    }),
  ),
  updatedTranscript: z.string(),
  duration: z.number(),
  unread: z.boolean(),
});
export type Call = z.infer<typeof callSchema>;
