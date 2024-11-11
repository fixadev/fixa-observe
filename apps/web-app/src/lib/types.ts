import { type Test, type Call, type Prisma } from "@prisma/client";
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

export type CallWithIncludes = Prisma.CallGetPayload<{
  include: {
    messages: true;
    errors: true;
    intent: true;
    testAgent: true;
  };
}>;

export type TestWithIncludes = Prisma.TestGetPayload<{
  include: {
    calls: {
      include: {
        messages: true;
        errors: true;
        intent: true;
        testAgent: true;
      };
    };
  };
}>;

export type TestWithCalls = Test & { calls: Call[] };

export type AgentWithIncludes = Prisma.AgentGetPayload<{
  include: {
    intents: true;
    enabledTestAgents: true;
  };
}>;
