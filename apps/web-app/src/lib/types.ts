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
    latencyBlocks: true;
    interruptions: true;
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
        latencyBlocks: true;
        interruptions: true;
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
    tests: {
      include: {
        calls: true;
      };
    };
    enabledTestAgents: true;
  };
}>;

export type Filter = z.infer<typeof FilterSchema>;
export const FilterSchema = z.object({
  lookbackPeriod: z.object({
    label: z.string(),
    value: z.number(),
  }),
  timeRange: z
    .object({
      start: z.number(),
      end: z.number(),
    })
    .optional(),
  agentId: z.string().optional(),
  regionId: z.string().optional(),
  chartPeriod: z.number(),
  customerCallId: z.string().optional(),
  metadata: z.record(z.string(), z.string().or(z.undefined())).optional(),
  // latencyThreshold: z.object({
  //   enabled: z.boolean(),
  //   value: z.number(),
  // }),
  // interruptionThreshold: z.object({
  //   enabled: z.boolean(),
  //   value: z.number(),
  // }),
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
