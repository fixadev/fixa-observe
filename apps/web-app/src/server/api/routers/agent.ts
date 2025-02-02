import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { AgentService } from "@repo/services/src/agent";
import { db } from "~/server/db";
import { AgentSchema } from "@repo/types/src/index";
import { env } from "~/env";

const agentServiceInstance = new AgentService(db);

export const agentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(AgentSchema)
    .mutation(async ({ input, ctx }) => {
      return await agentServiceInstance.createAgent({
        phoneNumber: input.phoneNumber,
        name: input.name,
        customerAgentId: input.customerAgentId ?? undefined,
        systemPrompt: input.systemPrompt,
        ownerId: ctx.orgId,
      });
    }),

  updateName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await agentServiceInstance.updateAgentName(
        input.id,
        input.name,
        ctx.orgId,
      );
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await agentServiceInstance.getAgent(input.id, ctx.orgId);
    }),

  getTestAgents: protectedProcedure.query(async ({ ctx }) => {
    return await agentServiceInstance.getTestAgents(ctx.orgId);
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
        ctx.orgId,
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
        ownerId: ctx.orgId,
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const orgId = ctx.orgId ?? env.DEMO_ORG_ID;
    return await agentServiceInstance.getAllAgents(orgId);
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await agentServiceInstance.deleteAgent(input.id, ctx.orgId);
    }),
});
