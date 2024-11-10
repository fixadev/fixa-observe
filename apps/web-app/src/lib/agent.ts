import {
  type AgentSchema,
  type TestAgentSchema,
  type TestAgentTemplateSchema,
  IntentSchema,
} from "prisma/generated/zod";
import { type z } from "zod";

export type Agent = z.infer<typeof AgentSchema>;

export type TestAgent = z.infer<typeof TestAgentSchema>;
export type TestAgentWithoutId = Omit<TestAgent, "id">;

export type TestAgentTemplate = z.infer<typeof TestAgentTemplateSchema>;

export type IntentWithoutId = Omit<Intent, "id">;
export type Intent = z.infer<typeof IntentSchema>;

export const IntentSchemaWithoutId = IntentSchema.omit({ id: true });
