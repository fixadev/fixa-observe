import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TestService } from "@repo/services/src/test";
import { db } from "~/server/db";
import { posthogClient } from "~/server/clients/posthogClient";

const testServiceInstance = new TestService(db, posthogClient);

export const testRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await testServiceInstance.get(input.id, ctx.orgId);
    }),

  getAll: protectedProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await testServiceInstance.getAll(input.agentId, ctx.orgId);
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
        ownerId: ctx.orgId,
        agentId: input.agentId,
        scenarioIds: input.scenarioIds,
        testAgentIds: input.testAgentIds,
      });
    }),

  getLastTest: protectedProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await testServiceInstance.getLastTest(input.agentId, ctx.orgId);
    }),
});
