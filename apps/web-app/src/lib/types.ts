import { type Prisma } from "@prisma/client";
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

export type EvalResultWithIncludes = Prisma.EvalResultGetPayload<{
  include: {
    eval: true;
  };
}>;

export type CallWithIncludes = Prisma.CallGetPayload<{
  include: {
    messages: true;
    scenario: {
      include: {
        evals: true;
      };
    };
    testAgent: true;
    evalResults: {
      include: {
        eval: true;
      };
    };
  };
}>;

export type TestWithIncludes = Prisma.TestGetPayload<{
  include: {
    calls: {
      include: {
        messages: true;
        scenario: {
          include: {
            evals: true;
          };
        };
        testAgent: true;
        evalResults: {
          include: {
            eval: true;
          };
        };
      };
    };
  };
}>;

export type TestWithCalls = Prisma.TestGetPayload<{
  include: {
    calls: true;
  };
}>;

export type AgentWithIncludes = Prisma.AgentGetPayload<{
  include: {
    scenarios: {
      include: {
        evals: true;
      };
    };
    enabledTestAgents: true;
  };
}>;
