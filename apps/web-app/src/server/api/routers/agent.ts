import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { AgentService } from "@repo/services/src/agent";
import { db } from "~/server/db";
import { AgentSchema } from "@repo/types/src/index";

const agentServiceInstance = new AgentService(db);

export const agentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(AgentSchema)
    .mutation(async ({ input, ctx }) => {
      return await agentServiceInstance.createAgent(
        input.phoneNumber,
        input.name,
        input.systemPrompt,
        ctx.user.id,
      );
    }),

  upsert: protectedProcedure
    .input(AgentSchema.partial())
    .mutation(async ({ input, ctx }) => {
      return await agentServiceInstance.upsertAgent(input, ctx.user.id);
    }),

  updateName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ input }) => {
      return await agentServiceInstance.updateAgentName(input.id, input.name);
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await agentServiceInstance.getAgent(input.id);
    }),

  getTestAgents: protectedProcedure.query(async ({ ctx }) => {
    return await agentServiceInstance.getTestAgents(ctx.user.id);
  }),

  toggleTestAgentEnabled: protectedProcedure
    .input(
      z.object({
        agentId: z.string(),
        testAgentId: z.string(),
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

  updateAgent: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        agent: z.object({
          ...AgentSchema.omit({ id: true }).partial().shape,
        }),
      }),
    )
    .mutation(async ({ input }) => {
      return await agentServiceInstance.updateAgent(input);
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    // test w 11x as ownerId
    return await agentServiceInstance.getAllAgents(ctx.user.id);
  }),

  getAllFor11x: protectedProcedure.query(async ({ ctx }) => {
    // test w 11x as ownerId
    return await agentServiceInstance.getAllAgents("11x");
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await agentServiceInstance.deleteAgent(input.id);
    }),
});
