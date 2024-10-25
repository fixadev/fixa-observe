import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createSurveyInput, surveySchema } from "~/lib/survey";
import { surveyService } from "~/server/services/survey";
import { db } from "~/server/db";

const surveyServiceInstance = surveyService({ db });

export const surveyRouter = createTRPCRouter({
  createSurvey: protectedProcedure
    .input(createSurveyInput)
    .mutation(async ({ ctx, input }) => {
      return await surveyServiceInstance.createSurvey(input, ctx.user.id);
    }),

  getSurvey: protectedProcedure
    .input(z.object({ surveyId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await surveyServiceInstance.getSurvey(input.surveyId, ctx.user.id);
    }),

  getSurveyAttributes: protectedProcedure
    .input(z.object({ surveyId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await surveyServiceInstance.getSurveyAttributes(input.surveyId);
    }),

  addColumn: protectedProcedure
    .input(z.object({ attributeId: z.string(), displayIndex: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await surveyServiceInstance.addColumn(
        input.attributeId,
        input.displayIndex,
        ctx.user.id,
      );
    }),

  updateColumnAttribute: protectedProcedure
    .input(z.object({ columnId: z.string(), attributeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return {
        status: 200,
      };
    }),

  updateColumnsOrder: protectedProcedure
    .input(
      z.object({
        oldOrder: z.array(z.string()),
        oldIndex: z.number(),
        newIndex: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return {
        status: 200,
      };
    }),

  updateSurvey: protectedProcedure
    .input(surveySchema)
    .mutation(async ({ ctx, input }) => {
      return await surveyServiceInstance.updateSurvey(input, ctx.user.id);
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

  deleteSurvey: protectedProcedure
    .input(z.object({ surveyId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await surveyServiceInstance.deleteSurvey(
        input.surveyId,
        ctx.user.id,
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
