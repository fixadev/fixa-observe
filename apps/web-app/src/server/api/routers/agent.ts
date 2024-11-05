import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { AgentService } from "~/server/services/agent";
import { env } from "~/env";

const agentServiceInstance = new AgentService();

const retellApiKey = env.RETELL_API_KEY;

export const agentRouter = createTRPCRouter({
  listAgents: protectedProcedure
    .input(
      z.object({
        apiKey: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      return await agentServiceInstance.listAgents(
        input.apiKey ?? retellApiKey,
      );
    }),
  getStates: protectedProcedure
    .input(z.object({ apiKey: z.string().optional(), agentId: z.string() }))
    .query(async ({ input }) => {
      return await agentServiceInstance.getStates(
        input.apiKey ?? retellApiKey,
        input.agentId,
      );
    }),

  listCalls: protectedProcedure
    .input(z.object({ apiKey: z.string().optional(), agentId: z.string() }))
    .query(async ({ input }) => {
      return await agentServiceInstance.listCalls(
        input.apiKey ?? retellApiKey,
        input.agentId,
      );
    }),

  listCallsPerState: protectedProcedure
    .input(z.object({ apiKey: z.string().optional(), agentId: z.string() }))
    .query(async ({ input }) => {
      return await agentServiceInstance.listCallsPerNode(
        input.apiKey ?? retellApiKey,
        input.agentId,
      );
    }),
});
