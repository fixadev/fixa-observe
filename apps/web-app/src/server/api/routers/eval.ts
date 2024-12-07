import { createTRPCRouter, protectedProcedure } from "../trpc";
import { CreateGeneralEvalSchema, EvalGroupWithEvals } from "~/lib/eval";
import { EvalService } from "~/server/services/eval";
import { EvalGroupSchema, EvalSchema } from "prisma/generated/zod";
import { db } from "~/server/db";
import { z } from "zod";

const evalServiceInstance = new EvalService(db);

export const evalRouter = createTRPCRouter({
  getGeneralEvals: protectedProcedure.query(async ({ ctx }) => {
    return await evalServiceInstance.getGeneralEvals(ctx.user.id);
  }),
  createGeneralEval: protectedProcedure
    .input(CreateGeneralEvalSchema)
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

  updateEvalGroups: protectedProcedure
    .input(z.array(EvalGroupWithEvals))
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.syncEvalGroups(input, ctx.user.id);
    }),
});
