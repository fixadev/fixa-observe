import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createSurveyInput } from "~/lib/survey";
import { SurveySchema } from "../../../../prisma/generated/zod";
import { importPropertiesInput } from "~/lib/property";
import { surveyService } from "~/server/services/survey";
import { propertyService } from "~/server/services/property";
import { db } from "~/server/db";

const surveyServiceInstance = surveyService({ db });
const propertyServiceInstance = propertyService({ db });

export const surveyRouter = createTRPCRouter({
  createSurvey: protectedProcedure.input(createSurveyInput).mutation(async ({ ctx, input }) => {
    return await surveyServiceInstance.createSurvey(input, ctx.userId);
  }),

  addPropertiesToSurvey: protectedProcedure.input(importPropertiesInput).mutation(async ({ ctx, input }) => {
    const propertyIds = await propertyServiceInstance.createProperties(input.properties, ctx.userId);
    return await surveyServiceInstance.addPropertiesToSurvey(input.surveyId, propertyIds, ctx.userId);
  }),

  getProjectSurveys: protectedProcedure.input(z.object({ projectId: z.string() })).query(async ({ ctx, input }) => {
    return await surveyServiceInstance.getProjectSurveys(input.projectId, ctx.userId);
  }),

  getSurvey: protectedProcedure.input(z.object({ surveyId: z.string() })).query(async ({ ctx, input }) => {
    return await surveyServiceInstance.getSurvey(input.surveyId, ctx.userId);
  }),

  updateSurvey: protectedProcedure.input(SurveySchema).mutation(async ({ ctx, input }) => {
    return await surveyServiceInstance.updateSurvey(input, ctx.userId);
  }),
  
  deleteSurvey: protectedProcedure.input(z.object({ surveyId: z.string() })).mutation(async ({ ctx, input }) => {
    return await surveyServiceInstance.deleteSurvey(input.surveyId, ctx.userId);
  }),
});
