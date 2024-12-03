import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { AgentService } from "~/server/services/agent";
import {
  CreateAgentSchema,
  CreateScenarioSchema,
  UpdateScenarioSchema,
} from "~/lib/agent";
import { db } from "~/server/db";
import { generateScenariosFromPrompt } from "~/server/helpers/generateScenarios";
import { AgentSchema } from "prisma/generated/zod";

const agentServiceInstance = new AgentService(db);

export const agentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CreateAgentSchema)
    .mutation(async ({ input, ctx }) => {
      return await agentServiceInstance.createAgent(
        input.phoneNumber,
        input.name,
        input.systemPrompt,
        input.scenarios,
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

  // TODO: move all scenario related stuff to scenario router/service
  generateScenariosFromPrompt: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
        numberOfScenarios: z.number(),
        agentId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const scenarios = await generateScenariosFromPrompt(
        input.prompt,
        input.numberOfScenarios,
      );
      return await agentServiceInstance.createScenarios(
        input.agentId,
        scenarios,
      );
    }),

  createScenario: protectedProcedure
    .input(z.object({ agentId: z.string(), scenario: CreateScenarioSchema }))
    .mutation(async ({ input }) => {
      return await agentServiceInstance.createScenario(
        input.agentId,
        input.scenario,
      );
    }),

  updateScenario: protectedProcedure
    .input(z.object({ scenario: UpdateScenarioSchema }))
    .mutation(async ({ input }) => {
      console.log("INPUT: ", input.scenario);
      return await agentServiceInstance.updateScenario(input.scenario);
    }),

  deleteScenario: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await agentServiceInstance.deleteScenario(input.id);
    }),

  updateSettings: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        phoneNumber: z.string(),
        name: z.string(),
        enableSlackNotifications: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      return await agentServiceInstance.updateAgentSettings(input);
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
