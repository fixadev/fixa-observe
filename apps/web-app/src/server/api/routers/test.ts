import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TestService } from "~/server/services/test";
import { db } from "~/server/db";

const testServiceInstance = new TestService(db);

export const testRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await testServiceInstance.get(input.id);
    }),

  getAll: protectedProcedure
    .input(z.object({ agentId: z.string() }))
    .query(async ({ input }) => {
      return await testServiceInstance.getAll(input.agentId);
    }),

  run: protectedProcedure
    .input(z.object({ agentId: z.string(), intentIds: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      return await testServiceInstance.run(input.agentId, input.intentIds);
    }),
});
