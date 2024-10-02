import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createSurveyInput, surveySchema } from "~/lib/survey";
import { createSurvey, getProjectSurveys, getSurvey, updateSurvey, deleteSurvey, addBuildingsToSurvey } from "~/server/services/survey";
import { createOrUpdateBuildings } from "~/server/services/buildings";
import { importBuildingsInput } from "~/lib/building";


export const surveyRouter = createTRPCRouter({
  createSurvey: protectedProcedure.input(createSurveyInput).mutation(async ({ ctx, input }) => {
    return await createSurvey(input, ctx.userId, ctx.db);
  }),

  addBuildingsToSurvey: protectedProcedure.input(importBuildingsInput).mutation(async ({ ctx, input }) => {
    const buildingIds = await createOrUpdateBuildings(input.buildings, ctx.userId, ctx.db);
    return await addBuildingsToSurvey(input.surveyId, buildingIds, ctx.userId, ctx.db);
  }),

  getProjectSurveys: protectedProcedure.input(z.object({ projectId: z.string() })).query(async ({ ctx, input }) => {
    return await getProjectSurveys(input.projectId, ctx.userId, ctx.db);
  }),
  getSurvey: protectedProcedure.input(z.object({ surveyId: z.string() })).query(async ({ ctx, input }) => {
    return await getSurvey(input.surveyId, ctx.userId, ctx.db);
  }),
  updateSurvey: protectedProcedure.input(surveySchema).mutation(async ({ ctx, input }) => {
    return await updateSurvey(input, ctx.userId, ctx.db);
  }),
  deleteSurvey: protectedProcedure.input(z.object({ surveyId: z.string() })).mutation(async ({ ctx, input }) => {
    return await deleteSurvey(input.surveyId, ctx.userId, ctx.db);
  }),
});
