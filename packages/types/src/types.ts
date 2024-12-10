import { type Prisma } from "@prisma/client";
import { z } from "zod";
import { AlertSchema, EvalSetSchema, SavedSearchSchema } from "./generated";
import { AlertWithDetailsSchema } from "./alert";

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
        generalEvalOverrides: true;
      };
    };
    tests: {
      include: {
        calls: true;
      };
    };
    enabledTestAgents: true;
    enabledGeneralEvals: true;
  };
}>;

export const TimeRangeSchema = z.object({
  start: z.number(),
  end: z.number(),
});

export type Filter = z.infer<typeof FilterSchema>;
export const FilterSchema = z.object({
  lookbackPeriod: z.object({
    label: z.string(),
    value: z.number(),
  }),
  timeRange: z.union([TimeRangeSchema, z.null(), z.undefined()]),
  agentId: z.string().optional(),
  chartPeriod: z.number(),
  customerCallId: z.union([z.string(), z.null(), z.undefined()]),
  metadata: z.record(z.string(), z.string().or(z.undefined())).optional(),
  evalSets: z.array(EvalSetSchema).optional(),
  alerts: z.array(AlertSchema).optional(),
});

export type SavedSearchWithIncludes = z.infer<typeof SavedSearchWithIncludes>;
export const SavedSearchWithIncludes = FilterSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  ownerId: z.string(),
  name: z.string(),
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
