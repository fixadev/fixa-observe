import { createTRPCRouter } from "../trpc";
import { protectedProcedure } from "../trpc";
import { ScenarioService } from "~/server/services/scenario";
import { CreateScenarioSchema, UpdateScenarioSchema } from "~/lib/scenario";
import { z } from "zod";
import { db } from "~/server/db";
import { generateScenariosFromPrompt } from "~/server/helpers/generateScenarios";

const scenarioServiceInstance = new ScenarioService(db);

export const scenarioRouter = createTRPCRouter({
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
      return await scenarioServiceInstance.createScenarios(
        input.agentId,
        scenarios,
      );
    }),

  createScenario: protectedProcedure
    .input(z.object({ agentId: z.string(), scenario: CreateScenarioSchema }))
    .mutation(async ({ input }) => {
      return await scenarioServiceInstance.createScenario(
        input.agentId,
        input.scenario,
      );
    }),

  updateScenario: protectedProcedure
    .input(z.object({ scenario: UpdateScenarioSchema }))
    .mutation(async ({ input }) => {
      console.log("INPUT: ", input.scenario);
      return await scenarioServiceInstance.updateScenario(input.scenario);
    }),

  deleteScenario: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await scenarioServiceInstance.deleteScenario(input.id);
    }),
});
