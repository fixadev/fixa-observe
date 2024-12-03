import { createTRPCRouter, protectedProcedure } from "../trpc";
import { CreateGeneralEvalSchema } from "~/lib/agent";
import { AgentService } from "~/server/services/agent";
import { db } from "~/server/db";
import { EvalSchema } from "prisma/generated/zod";
import { z } from "zod";

const agentServiceInstance = new AgentService(db);

export const evalRouter = createTRPCRouter({
  getGeneralEvals: protectedProcedure.query(async ({ ctx }) => {
    return await agentServiceInstance.getGeneralEvals(ctx.user.id);
  }),
  createGeneralEval: protectedProcedure
    .input(CreateGeneralEvalSchema)
    .mutation(async ({ input, ctx }) => {
      return await agentServiceInstance.createGeneralEval(ctx.user.id, input);
    }),

  updateGeneralEval: protectedProcedure
    .input(EvalSchema)
    .mutation(async ({ input, ctx }) => {
      return await agentServiceInstance.updateGeneralEval(input);
    }),

  toggleGeneralEval: protectedProcedure
    .input(
      z.object({ id: z.string(), agentId: z.string(), enabled: z.boolean() }),
    )
    .mutation(async ({ input, ctx }) => {
      return await agentServiceInstance.toggleGeneralEval(input);
    }),

  deleteGeneralEval: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await agentServiceInstance.deleteGeneralEval(input.id);
    }),
});
