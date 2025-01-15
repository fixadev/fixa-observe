import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  EvaluationGroupWithIncludesSchema,
  EvaluationTemplateSchema,
  GeneralEvaluationWithIncludesSchema,
} from "@repo/types/src/index";
import { EvaluationService } from "@repo/services/src/evaluation";
import { EvaluationSchema } from "@repo/types/src/index";
import { z } from "zod";
import { db } from "~/server/db";
import { createEvaluationGroupsFromPrompt } from "~/server/helpers/generateEvaluationGroupsFromPrompt";
import { env } from "~/env";

const evalServiceInstance = new EvaluationService(db);

export const evaluationRouter = createTRPCRouter({
  updateGeneralEvaluations: protectedProcedure
    .input(
      z.object({
        agentId: z.string(),
        generalEvaluations: z.array(GeneralEvaluationWithIncludesSchema),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.updateGeneralEvaluations({
        agentId: input.agentId,
        generalEvaluations: input.generalEvaluations,
        ownerId: ctx.orgId,
      });
    }),

  getTemplates: publicProcedure.query(async ({ ctx }) => {
    const orgId = ctx.orgId ?? env.DEMO_ORG_ID;
    return await evalServiceInstance.getTemplates({
      ownerId: orgId,
    });
  }),

  createTemplate: protectedProcedure
    .input(EvaluationTemplateSchema)
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.createTemplate({
        template: input,
        ownerId: ctx.orgId,
      });
    }),

  updateTemplate: protectedProcedure
    .input(EvaluationTemplateSchema)
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.updateTemplate({
        template: input,
        ownerId: ctx.orgId,
      });
    }),

  deleteTemplate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await evalServiceInstance.deleteTemplate({
        id: input.id,
        ownerId: ctx.orgId,
      });
      return input.id;
    }),

  update: protectedProcedure
    .input(EvaluationSchema)
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.update({
        evaluation: input,
        ownerId: ctx.orgId,
      });
    }),

  toggleEnabled: protectedProcedure
    .input(
      z.object({ id: z.string(), agentId: z.string(), enabled: z.boolean() }),
    )
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.toggleEnabled({
        ...input,
        ownerId: ctx.orgId,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.delete({
        id: input.id,
        ownerId: ctx.orgId,
      });
    }),

  getGroups: protectedProcedure.query(async ({ ctx }) => {
    return await evalServiceInstance.getGroups({
      ownerId: ctx.orgId,
    });
  }),
  createGroup: protectedProcedure
    .input(EvaluationGroupWithIncludesSchema)
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.createGroup({
        group: input,
        ownerId: ctx.orgId,
      });
    }),

  createGroupsFromPrompt: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
        count: z.number(),
        savedSearchId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await createEvaluationGroupsFromPrompt({
        prompt: input.prompt,
        count: input.count,
        savedSearchId: input.savedSearchId,
        orgId: ctx.orgId,
      });
    }),
  updateGroup: protectedProcedure
    .input(EvaluationGroupWithIncludesSchema)
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.updateGroup({
        group: input,
        ownerId: ctx.orgId,
      });
    }),
  deleteGroup: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await evalServiceInstance.deleteGroup({
        id: input.id,
        ownerId: ctx.orgId,
      });
    }),
});
