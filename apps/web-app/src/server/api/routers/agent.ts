import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { AgentService } from "~/server/services/agent";
import { IntentSchemaWithoutId } from "~/lib/agent";
import { db } from "~/server/db";

const agentServiceInstance = new AgentService(db);

export const agentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        phoneNumber: z.string(),
        name: z.string(),
        prompt: z.string(),
        intents: z.array(IntentSchemaWithoutId),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const agent = await agentServiceInstance.createAgent(
        input.phoneNumber,
        input.name,
        input.prompt,
        input.intents,
        ctx.user.id,
      );
      const testAgents = await agentServiceInstance.createTestAgents(agent.id);
      return { agent, testAgents };
    }),

  getAgent: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ input }) => {
      return await agentServiceInstance.getAgent(input.id);
    }),

  toggleTestAgentEnabled: protectedProcedure
    .input(
      z.object({
        testAgentId: z.string().cuid(),
        enabled: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      return await agentServiceInstance.toggleTestAgentEnabled(
        input.testAgentId,
        input.enabled,
      );
    }),
});
