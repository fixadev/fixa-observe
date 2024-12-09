import { createTRPCRouter, protectedProcedure } from "../trpc";
import { EvalSetWithIncludesSchema } from "@repo/types";
import { EvalService } from "@repo/services";
import { EvalSchema } from "@repo/types";
import { z } from "zod";
import { db } from "~/server/db";

const evalServiceInstance = new EvalService(db);

export const evalRouter = createTRPCRouter({
  getGeneralEvals: protectedProcedure.query(async ({ ctx }) => {
    return await evalServiceInstance.getGeneralEvals(ctx.user.id);
  }),
  createGeneralEval: protectedProcedure
    .input(EvalSchema)
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.createGeneralEval(ctx.user.id, input);
    }),

  updateGeneralEval: protectedProcedure
    .input(EvalSchema)
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.updateGeneralEval(input);
    }),

  toggleGeneralEval: protectedProcedure
    .input(
      z.object({ id: z.string(), agentId: z.string(), enabled: z.boolean() }),
    )
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.toggleGeneralEval(input);
    }),

  deleteGeneralEval: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.deleteGeneralEval(input.id);
    }),

  getSets: protectedProcedure.query(async ({ ctx }) => {
    return await evalServiceInstance.getSets(ctx.user.id);
  }),
  createSet: protectedProcedure
    .input(EvalSetWithIncludesSchema)
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.createSet(ctx.user.id, input);
    }),
  updateSet: protectedProcedure
    .input(EvalSetWithIncludesSchema)
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.updateSet(ctx.user.id, input);
    }),
  deleteSet: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.deleteSet(ctx.user.id, input.id);
    }),
});
