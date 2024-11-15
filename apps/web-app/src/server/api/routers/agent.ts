import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { AgentService } from "~/server/services/agent";
import { CreateAgentSchema, IntentSchemaWithoutId } from "~/lib/agent";
import { db } from "~/server/db";
import { generateIntentsFromPrompt } from "~/server/helpers/generateIntents";
import { IntentSchema } from "prisma/generated/zod";

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

  updateIntents: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        intents: z.array(IntentSchema.or(IntentSchemaWithoutId)),
      }),
    )
    .mutation(async ({ input }) => {
      return await agentServiceInstance.updateAgentIntents(
        input.id,
        input.intents,
      );
    }),

  updateSettings: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        phoneNumber: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return await agentServiceInstance.updateAgentSettings(input);
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await agentServiceInstance.getAllAgents(ctx.user.id);
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

  generateIntentsFromPrompt: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
        numberOfIntents: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      return await generateIntentsFromPrompt(
        input.prompt,
        input.numberOfIntents,
      );
    }),
});
