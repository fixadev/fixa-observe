import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { agentService } from "~/server/services/agent";
import { env } from "~/env";

const agentServiceInstance = agentService();

const retellApiKey = env.RETELL_API_KEY;

export const agentRouter = createTRPCRouter({
  listAgents: protectedProcedure
    .input(
      z.object({
        apiKey: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return await agentServiceInstance.listAgents(
        input.apiKey ?? retellApiKey,
      );
    }),
  getFlow: protectedProcedure
    .input(z.object({ apiKey: z.string().optional(), agentId: z.string() }))
    .mutation(async ({ input }) => {
      return await agentServiceInstance.getFlow(
        input.apiKey ?? retellApiKey,
        input.agentId,
      );
    }),
  listCalls: protectedProcedure
    .input(z.object({ apiKey: z.string().optional(), agentId: z.string() }))
    .mutation(async ({ input }) => {
      return await agentServiceInstance.listCalls(
        input.apiKey ?? retellApiKey,
        input.agentId,
      );
    }),
});
