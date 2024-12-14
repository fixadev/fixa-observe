import { createTRPCRouter, protectedProcedure } from "../trpc";
import { EvalSetWithIncludesSchema } from "@repo/types/src/index";
import { EvalService } from "@repo/services/src/eval";
import { EvalSchema } from "@repo/types/src/index";
import { z } from "zod";
import { db } from "~/server/db";

const evalServiceInstance = new EvalService(db);

export const evalRouter = createTRPCRouter({
  getGeneralEvals: protectedProcedure.query(async ({ ctx }) => {
    return await evalServiceInstance.getGeneralEvals({
      userId: ctx.user.id,
    });
  }),
  createGeneralEval: protectedProcedure
    .input(EvalSchema)
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.createGeneralEval({
        evaluation: input,
        userId: ctx.user.id,
      });
    }),

  updateGeneralEval: protectedProcedure
    .input(EvalSchema)
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.updateGeneralEval({
        evaluation: input,
        userId: ctx.user.id,
      });
    }),

  toggleGeneralEval: protectedProcedure
    .input(
      z.object({ id: z.string(), agentId: z.string(), enabled: z.boolean() }),
    )
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.toggleGeneralEval({
        ...input,
        userId: ctx.user.id,
      });
    }),

  deleteGeneralEval: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.deleteGeneralEval({
        id: input.id,
        userId: ctx.user.id,
      });
    }),

  getSets: protectedProcedure.query(async ({ ctx }) => {
    return await evalServiceInstance.getSets({
      userId: ctx.user.id,
    });
  }),
  createSet: protectedProcedure
    .input(EvalSetWithIncludesSchema)
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.createSet({
        set: input,
        userId: ctx.user.id,
      });
    }),
  updateSet: protectedProcedure
    .input(EvalSetWithIncludesSchema)
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.updateSet({
        set: input,
        userId: ctx.user.id,
      });
    }),
  deleteSet: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.deleteSet({
        id: input.id,
        userId: ctx.user.id,
      });
    }),
});
