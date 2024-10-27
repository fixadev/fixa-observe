import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createSurveyInput, surveySchema } from "~/lib/survey";
import { surveyService } from "~/server/services/survey";
import { db } from "~/server/db";

const surveyServiceInstance = surveyService({ db });

export const surveyRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createSurveyInput)
    .mutation(async ({ ctx, input }) => {
      return await surveyServiceInstance.create(input, ctx.user.id);
    }),

  get: protectedProcedure
    .input(z.object({ surveyId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await surveyServiceInstance.get(input.surveyId, ctx.user.id);
    }),

  update: protectedProcedure
    .input(surveySchema)
    .mutation(async ({ ctx, input }) => {
      return await surveyServiceInstance.update(input, ctx.user.id);
    }),

  delete: protectedProcedure
    .input(z.object({ surveyId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await surveyServiceInstance.delete(input.surveyId, ctx.user.id);
    }),

  createColumn: protectedProcedure
    .input(
      z.object({
        surveyId: z.string(),
        attributeId: z.string(),
        displayIndex: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const column = await surveyServiceInstance.createColumn({
        surveyId: input.surveyId,
        attributeId: input.attributeId,
        displayIndex: input.displayIndex,
        userId: ctx.user.id,
      });
      return column;
    }),

  updateColumnAttribute: protectedProcedure
    .input(z.object({ columnId: z.string(), attributeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await surveyServiceInstance.updateColumnAttribute(
        input.columnId,
        input.attributeId,
        ctx.user.id,
      );
    }),

  deleteColumn: protectedProcedure
    .input(z.object({ columnId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await surveyServiceInstance.deleteColumn(
        input.columnId,
        ctx.user.id,
      );
    }),

  updateColumnsOrder: protectedProcedure
    .input(
      z.object({
        columnIds: z.array(z.string()),
        oldIndex: z.number(),
        newIndex: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      return await surveyServiceInstance.updateColumnsOrder(
        input.columnIds,
        input.oldIndex,
        input.newIndex,
      );
    }),

  updatePropertiesOrder: protectedProcedure
    .input(
      z.object({
        propertyIds: z.array(z.string()),
        oldIndex: z.number(),
        newIndex: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      await surveyServiceInstance.updatePropertiesOrder(
        input.propertyIds,
        input.oldIndex,
        input.newIndex,
      );
    }),

  importNDXPDF: protectedProcedure
    .input(z.object({ surveyId: z.string(), pdfUrl: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await surveyServiceInstance.importNDXPDF(
        input.surveyId,
        input.pdfUrl,
        ctx.user.id,
      );
    }),
});
