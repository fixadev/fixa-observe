import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createSurveyInput, surveySchema } from "~/lib/survey";
import {
  attributeSchema,
  createPropertySchema,
  propertySchema,
} from "~/lib/property";
import { surveyService } from "~/server/services/survey";
import { propertyService } from "~/server/services/property";
import { db } from "~/server/db";

const surveyServiceInstance = surveyService({ db });

export const surveyRouter = createTRPCRouter({
  createSurvey: protectedProcedure
    .input(createSurveyInput)
    .mutation(async ({ ctx, input }) => {
      return await surveyServiceInstance.createSurvey(input, ctx.user.id);
    }),

  getProjectSurveys: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await surveyServiceInstance.getProjectSurveys(
        input.projectId,
        ctx.user.id,
      );
    }),

  getSurvey: protectedProcedure
    .input(z.object({ surveyId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await surveyServiceInstance.getSurvey(input.surveyId, ctx.user.id);
    }),

  getSurveyAttributes: protectedProcedure
    .input(z.object({ surveyId: z.string() }))
    .query(async ({ ctx, input }) => {
      const attributes = await surveyServiceInstance.getSurveyAttributes(
        input.surveyId,
      );
      if (attributes.length === 0) {
        // get basic attributes
        return await surveyServiceInstance.getAttributes(ctx.user.id);
      }
      return attributes;
    }),

  addColumn: protectedProcedure
    .input(z.object({ attributeId: z.string(), displayIndex: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return {
        status: 200,
      };
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
