import { type Survey, type PrismaClient } from "@prisma/client";
import { type CreateSurveyInput } from "~/lib/survey";

export const surveyService = ({
  db,
}: {
  db: PrismaClient;
}) => {
  return {
    getProjectSurveys: async (
      projectId: string,
      userId: string,
    ) => {
      const surveys = await db.survey.findMany({
        where: { projectId: projectId, ownerId: userId },
      });
      return surveys;
    },

    getSurvey: async (
      surveyId: string,
      userId: string,
    ) => {
      const survey = await db.survey.findUnique({
        where: { id: surveyId, ownerId: userId },
        include: {
          properties: true,
        },
      });
      console.log("survey", survey);
      return survey;
    },

    createSurvey: async (
      input: CreateSurveyInput,
      userId: string,
    ) => {
      const survey = await db.survey.create({
        data: { name: input.surveyName, projectId: input.projectId, ownerId: userId  }
      });
      return survey;
    },

    updateSurvey: async (
      surveyData: Partial<Survey>,
      userId: string,
    ) => {
      const result = await db.survey.update({
        where: { id: surveyData.id, ownerId: userId },
        data: surveyData
      });
      return result;
    },

    addPropertiesToSurvey: async (
      surveyId: string,
      propertyIds: string[],
      userId: string,
    ) => {
      console.log("propertyIds", propertyIds);
      const survey = await db.survey.update({
        where: { id: surveyId, ownerId: userId },
        data: { properties: { connect: propertyIds.map(id => ({ id })) } }
      });
      return survey;
    },

    deleteSurvey: async (
      surveyId: string,
      userId: string,
    ) => {
      const survey = await db.survey.delete({
        where: { id: surveyId, ownerId: userId }
      });
      return survey;
    },
  };
};
