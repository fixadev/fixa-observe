import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createSurveyInput, surveySchema } from "~/lib/survey";
import { importBuildingsInput } from "~/lib/building";
import { surveyService } from "~/server/services/survey";
import { buildingService } from "~/server/services/buildings";
import { db } from "~/server/db";

const surveyServiceInstance = surveyService({ db });
const buildingServiceInstance = buildingService({ db });

export const surveyRouter = createTRPCRouter({
  createSurvey: protectedProcedure.input(createSurveyInput).mutation(async ({ ctx, input }) => {
    return await surveyServiceInstance.createSurvey(input, ctx.userId);
  }),

  addBuildingsToSurvey: protectedProcedure.input(importBuildingsInput).mutation(async ({ ctx, input }) => {
    const buildingIds = await buildingServiceInstance.createBuildings(input.buildings, ctx.userId);
    return await surveyServiceInstance.addBuildingsToSurvey(input.surveyId, buildingIds, ctx.userId);
  }),

  getProjectSurveys: protectedProcedure.input(z.object({ projectId: z.string() })).query(async ({ ctx, input }) => {
    return await surveyServiceInstance.getProjectSurveys(input.projectId, ctx.userId);
  }),

  getSurvey: protectedProcedure.input(z.object({ surveyId: z.string() })).query(async ({ ctx, input }) => {
    return await surveyServiceInstance.getSurvey(input.surveyId, ctx.userId);
  }),

  updateSurvey: protectedProcedure.input(surveySchema).mutation(async ({ ctx, input }) => {
    return await surveyServiceInstance.updateSurvey(input, ctx.userId);
  }),
  
  deleteSurvey: protectedProcedure.input(z.object({ surveyId: z.string() })).mutation(async ({ ctx, input }) => {
    return await surveyServiceInstance.deleteSurvey(input.surveyId, ctx.userId);
  }),
});
