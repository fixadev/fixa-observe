import { z } from "zod";
import { createTRPCRouter } from "../trpc";
import { protectedProcedure } from "../trpc";
import { ScenarioService } from "@repo/services/src/scenario";
import {
  CreateScenarioSchema,
  UpdateScenarioSchema,
} from "@repo/types/src/index";
import { db } from "~/server/db";
import { generateScenariosFromPrompt } from "~/server/helpers/generateScenarios";

const scenarioServiceInstance = new ScenarioService(db);

export const scenarioRouter = createTRPCRouter({
  generateFromPrompt: protectedProcedure
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
      return await scenarioServiceInstance.createScenarios(
        input.agentId,
        scenarios,
      );
    }),

  create: protectedProcedure
    .input(
      z.object({
        agentId: z.string(),
        scenario: CreateScenarioSchema,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await scenarioServiceInstance.createScenario({
        agentId: input.agentId,
        scenario: input.scenario,
        userId: ctx.user.id,
      });
    }),

  // todo: add ownerIds to all scenarios in prod
  update: protectedProcedure
    .input(UpdateScenarioSchema)
    .mutation(async ({ input, ctx }) => {
      return await scenarioServiceInstance.updateScenario(input, ctx.user.id);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await scenarioServiceInstance.deleteScenario(
        input.id,
        ctx.user.id,
      );
    }),
});
