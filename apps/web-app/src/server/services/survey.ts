import { type Attribute, type PrismaClient } from "@prisma/client";
import { type CreateSurveyInput } from "~/lib/survey";
import { type SurveySchema } from "~/lib/survey";


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
          properties: true
        },
      });
      console.log("survey", survey);
      return survey;
    },

    getAttributes: async (userId: string) => {
      return db.attribute.findMany({
        where: {
          OR: [{ ownerId: userId }, { ownerId: null }],
        },
      });
    },

    getSurveyAttributes: async (
      surveyId: string
    ) => {
      const attributes = await db.attributesOnSurveys.findMany({
        where: { surveyId },
        include: { attribute: true }
      });
      return attributes.sort((a, b) => a.attributeIndex - b.attributeIndex).map((attr) => attr.attribute);
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
      surveyData: SurveySchema,
      userId: string,
    ) => {
      const result = await db.survey.update({
        where: { id: surveyData.id, ownerId: userId },
        data: { ...surveyData }
      });
      return result;
    },

    updateAttributesOrder: async (
      surveyId: string,
      attributes: Attribute[],
      userId: string,
    ) => { 

      await db.survey.update({
        where: { id: surveyId, ownerId: userId },
        data: {
          attributes: {
            deleteMany: {}
          }
        }
      });

      const attributesOnSurveys = attributes.map((attribute, index) => ({
        attributeId: attribute.id,
        attributeIndex: index
      }));

      const result = await db.survey.update({
        where: { id: surveyId, ownerId: userId },
        data: {
          attributes: {
            createMany: {
              data: attributesOnSurveys
            }
          }
        }
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
