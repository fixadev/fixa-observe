import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { AgentService } from "~/server/services/agent";
import { CreateAgentSchema } from "~/lib/agent";
import { db } from "~/server/db";

const agentServiceInstance = new AgentService(db);

export const agentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CreateAgentSchema)
    .mutation(async ({ input, ctx }) => {
      return await agentServiceInstance.createAgent(
        input.phoneNumber,
        input.name,
        input.systemPrompt,
        input.intents,
        ctx.user.id,
      );
    }),

  getAgent: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ input }) => {
      return await agentServiceInstance.getAgent(input.id);
    }),

  toggleTestAgentEnabled: protectedProcedure
    .input(
      z.object({
        agentId: z.string().cuid(),
        testAgentId: z.string().cuid(),
        enabled: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      return await agentServiceInstance.toggleTestAgentEnabled(
        input.agentId,
        input.testAgentId,
        input.enabled,
      );
    }),

  generateIntentsFromPrompt: protectedProcedure
    .input(z.object({ prompt: z.string() }))
    .mutation(async ({ input }) => {
      return await agentServiceInstance.generateIntentsFromPrompt(input.prompt);
    }),
});
