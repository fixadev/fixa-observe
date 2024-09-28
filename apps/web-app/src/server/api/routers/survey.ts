import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createSurveyInput } from "~/lib/survey";
import { createSurvey, getProjectSurveys, getSurveyDetails } from "~/server/services/survey";


export const surveyRouter = createTRPCRouter({
  createSurvey: protectedProcedure.input(createSurveyInput).mutation(async ({ ctx, input }) => {
    return await createSurvey(input, ctx.userId, ctx.db);
  }),
});
