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

  updateName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await agentServiceInstance.updateAgentName(
        input.id,
        input.name,
        ctx.user.id,
      );
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await agentServiceInstance.getAgent(input.id, ctx.user.id);
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
    .mutation(async ({ input, ctx }) => {
      return await agentServiceInstance.toggleTestAgentEnabled(
        input.agentId,
        input.testAgentId,
        input.enabled,
        ctx.user.id,
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
    .mutation(async ({ input, ctx }) => {
      return await agentServiceInstance.updateAgent({
        ...input,
        ownerId: ctx.user.id,
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await agentServiceInstance.getAllAgents(ctx.user.id);
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await agentServiceInstance.deleteAgent(input.id, ctx.user.id);
    }),
});
