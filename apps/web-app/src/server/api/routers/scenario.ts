import { z } from "zod";
import { createTRPCRouter } from "../trpc";
import { protectedProcedure } from "../trpc";
import { ScenarioService } from "@repo/services/src/scenario";
import { db } from "~/server/db";
import { ScenarioWithIncludesSchema } from "@repo/types/src/index";

const scenarioServiceInstance = new ScenarioService(db);

export const scenarioRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        agentId: z.string(),
        scenario: ScenarioWithIncludesSchema,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await scenarioServiceInstance.createScenario({
        agentId: input.agentId,
        scenario: input.scenario,
        ownerId: ctx.orgId,
      });
    }),

  // todo: add ownerIds to all scenarios in prod
  update: protectedProcedure
    .input(ScenarioWithIncludesSchema)
    .mutation(async ({ input, ctx }) => {
      return await scenarioServiceInstance.updateScenario({
        scenario: input,
        ownerId: ctx.orgId,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await scenarioServiceInstance.deleteScenario({
        id: input.id,
        ownerId: ctx.orgId,
      });
    }),
});
