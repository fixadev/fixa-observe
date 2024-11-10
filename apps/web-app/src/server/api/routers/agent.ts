import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { AgentService } from "~/server/services/agent";
import { IntentSchemaWithoutId } from "~/lib/agent";
import { db } from "~/server/db";

const agentServiceInstance = new AgentService(db);

export const agentRouter = createTRPCRouter({
  createAgent: protectedProcedure
    .input(
      z.object({
        phoneNumber: z.string(),
        prompt: z.string(),
        intents: z.array(IntentSchemaWithoutId),
      }),
    )
    .mutation(async ({ input }) => {
      const agent = await agentServiceInstance.createAgent(
        input.phoneNumber,
        input.prompt,
        input.intents,
      );
      const testAgents = await agentServiceInstance.createTestAgents(agent.id);
      return { agent, testAgents };
    }),

  getAgent: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ input }) => {
      return await agentServiceInstance.getAgent(input.id);
    }),
});
