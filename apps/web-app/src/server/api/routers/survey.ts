import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createSurveyInput, surveySchema } from "~/lib/survey";
import { createSurvey, getProjectSurveys, getSurveyDetails, updateSurvey, deleteSurvey } from "~/server/services/survey";


export const surveyRouter = createTRPCRouter({
  createSurvey: protectedProcedure.input(createSurveyInput).mutation(async ({ ctx, input }) => {
    return await createSurvey(input, ctx.userId, ctx.db);
  }),

  addBuildingsToSurvey: protectedProcedure.input(z.object({ surveyId: z.string(), buildingIds: z.array(z.string()) })).mutation(async ({ ctx, input }) => {
    return await addBuildingsToSurvey(input.surveyId, input.buildingIds, ctx.userId, ctx.db);
  }),

  getProjectSurveys: protectedProcedure.input(z.object({ projectId: z.string() })).mutation(async ({ ctx, input }) => {
    return await getProjectSurveys(input.projectId, ctx.userId, ctx.db);
  }),
  getSurveyDetails: protectedProcedure.input(z.object({ surveyId: z.string() })).mutation(async ({ ctx, input }) => {
    return await getSurveyDetails(input.surveyId, ctx.userId, ctx.db);
  }),
  updateSurvey: protectedProcedure.input(surveySchema).mutation(async ({ ctx, input }) => {
    return await updateSurvey(input, ctx.userId, ctx.db);
  }),
  deleteSurvey: protectedProcedure.input(z.object({ surveyId: z.string() })).mutation(async ({ ctx, input }) => {
    return await deleteSurvey(input.surveyId, ctx.userId, ctx.db);
  }),
});
