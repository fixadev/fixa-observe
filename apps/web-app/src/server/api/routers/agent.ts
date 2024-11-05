import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { agentService } from "~/server/services/agent";
import { platformOptions } from "~/lib/types";

const agentServiceInstance = agentService();

export const agentRouter = createTRPCRouter({
  listAgents: protectedProcedure
    .input(
      z.object({
        apiKey: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return await agentServiceInstance.listAgents(input.apiKey);
    }),
  getFlow: protectedProcedure
    .input(z.object({ apiKey: z.string(), agentId: z.string() }))
    .mutation(async ({ input }) => {
      return await agentServiceInstance.getFlow(input.apiKey, input.agentId);
    }),
  listCalls: protectedProcedure
    .input(z.object({ apiKey: z.string(), agentId: z.string() }))
    .mutation(async ({ input }) => {
      return await agentServiceInstance.listCalls(input.apiKey, input.agentId);
    }),
});
