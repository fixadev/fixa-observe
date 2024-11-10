import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TestService } from "~/server/services/test";
import { IntentSchemaWithoutId } from "~/lib/agent";
import { db } from "~/server/db";

const testServiceInstance = new TestService(db);

export const testRouter = createTRPCRouter({
  getTest: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ input }) => {
      return await testServiceInstance.getTest(input.id);
    }),
  runTestSuite: protectedProcedure
    .input(z.object({ agentId: z.string().cuid() }))
    .mutation(async ({ input }) => {
      return await testServiceInstance.runTestSuite(input.agentId);
    }),
});
