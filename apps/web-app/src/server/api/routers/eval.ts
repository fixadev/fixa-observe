import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  EvaluationGroupWithIncludesSchema,
  EvaluationTemplateSchema,
} from "@repo/types/src/index";
import { EvaluationService } from "@repo/services/src/evaluation";
import { EvaluationSchema } from "@repo/types/src/index";
import { z } from "zod";
import { db } from "~/server/db";

const evalServiceInstance = new EvaluationService(db);

export const evalRouter = createTRPCRouter({
  getGeneralEvals: protectedProcedure.query(async ({ ctx }) => {
    return await evalServiceInstance.getGeneralEvals({
      userId: ctx.user.id,
    });
  }),

  createTemplate: protectedProcedure
    .input(EvaluationTemplateSchema)
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.createTemplate({
        template: input,
        userId: ctx.user.id,
      });
    }),

  getTemplates: protectedProcedure.query(async ({ ctx }) => {
    return await evalServiceInstance.getTemplates({
      userId: ctx.user.id,
    });
  }),

  updateTemplate: protectedProcedure
    .input(EvaluationTemplateSchema)
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.updateTemplate({
        template: input,
        userId: ctx.user.id,
      });
    }),

  create: protectedProcedure
    .input(EvaluationSchema)
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.create({
        evaluation: input,
        userId: ctx.user.id,
      });
    }),

  update: protectedProcedure
    .input(EvaluationSchema)
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.update({
        evaluation: input,
        userId: ctx.user.id,
      });
    }),

  toggleEnabled: protectedProcedure
    .input(
      z.object({ id: z.string(), agentId: z.string(), enabled: z.boolean() }),
    )
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.toggleEnabled({
        ...input,
        userId: ctx.user.id,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.delete({
        id: input.id,
        userId: ctx.user.id,
      });
    }),

  getGroups: protectedProcedure.query(async ({ ctx }) => {
    return await evalServiceInstance.getGroups({
      userId: ctx.user.id,
    });
  }),
  createGroup: protectedProcedure
    .input(EvaluationGroupWithIncludesSchema)
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.createGroup({
        group: input,
        userId: ctx.user.id,
      });
    }),
  updateGroup: protectedProcedure
    .input(EvaluationGroupWithIncludesSchema)
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.updateGroup({
        group: input,
        userId: ctx.user.id,
      });
    }),
  deleteGroup: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.deleteGroup({
        id: input.id,
        userId: ctx.user.id,
      });
    }),
});
