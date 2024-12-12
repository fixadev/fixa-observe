import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TestService } from "~/server/services/test";
import { db } from "~/server/db";

const testServiceInstance = new TestService(db);

export const testRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await testServiceInstance.get(input.id, ctx.user.id);
    }),

  getAll: protectedProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await testServiceInstance.getAll(input.agentId, ctx.user.id);
    }),

  run: protectedProcedure
    .input(
      z.object({
        agentId: z.string(),
        scenarioIds: z.array(z.string()),
        testAgentIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await testServiceInstance.run({
        agentId: input.agentId,
        userId: ctx.user.id,
        scenarioIds: input.scenarioIds,
        testAgentIds: input.testAgentIds,
      });
    }),

  getLastTest: protectedProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await testServiceInstance.getLastTest(input.agentId, ctx.user.id);
    }),
});
