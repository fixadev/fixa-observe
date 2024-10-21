import { type Attribute, type PrismaClient } from "@prisma/client";
import { type CreateSurveyInput } from "~/lib/survey";
import { type SurveySchema } from "~/lib/survey";

export const surveyService = ({ db }: { db: PrismaClient }) => {
  return {
    getProjectSurveys: async (projectId: string, userId: string) => {
      const surveys = await db.survey.findMany({
        where: { projectId: projectId, ownerId: userId },
      });
      return surveys;
    },

    getSurvey: async (surveyId: string, userId: string) => {
      const survey = await db.survey.findUnique({
        where: { id: surveyId, ownerId: userId },
        include: {
          properties: {
            include: {
              brochures: true,
              contacts: true,
              emailThreads: {
                include: {
                  emails: {
                    include: {
                      attachments: true,
                    },
                    orderBy: {
                      createdAt: "asc",
                    },
                  },
                },
              },
            },
            orderBy: {
              displayIndex: "asc",
            },
          },
        },
      });
      return survey;
    },

    getAttributes: async (userId: string) => {
      return db.attribute.findMany({
        where: {
          OR: [{ ownerId: userId }, { ownerId: null }],
        },
        // orderBy: {
        //   defaultIndex: "asc",
        // },
      });
    },

    getSurveyAttributes: async (surveyId: string) => {
      const attributes = await db.attributesOnSurveys.findMany({
        where: { surveyId },
        include: { attribute: true },
      });
      return attributes
        .sort((a, b) => a.attributeIndex - b.attributeIndex)
        .map((attr) => attr.attribute);
    },

    createSurvey: async (input: CreateSurveyInput, userId: string) => {
      const survey = await db.survey.create({
        data: {
          name: input.surveyName,
          projectId: input.projectId,
          ownerId: userId,
        },
      });
      return survey;
    },

    updateSurvey: async (surveyData: SurveySchema, userId: string) => {
      const result = await db.survey.update({
        where: { id: surveyData.id, ownerId: userId },
        data: { ...surveyData },
      });
      return result;
    },

    createAttributes: async (
      surveyId: string,
      attributes: Attribute[],
      userId: string,
    ) => {
      const result = await db.attribute.createMany({
        data: attributes.map((attribute) => ({
          ...attribute,
          ownerId: userId,
        })),
      });

      return result;
    },

    // TODO: simplify this
    addAttributes: async (
      surveyId: string,
      attributes: Attribute[],
      userId: string,
    ) => {
      const existingAttributes = await db.attribute.findMany({
        where: {
          id: { in: attributes.map((attr) => attr.id) },
        },
      });
      const attributesToCreate = attributes
        .filter(
          (attribute) =>
            !existingAttributes.some(
              (existing) => existing.id === attribute.id,
            ),
        )
        .map((attribute) => ({ ...attribute, ownerId: userId }));

      await db.attribute.createMany({
        data: attributesToCreate,
      });

      const result = await db.survey.update({
        where: { id: surveyId, ownerId: userId },
        data: {
          attributes: {
            createMany: {
              data: attributesToCreate.map((attribute) => ({
                attributeId: attribute.id,
                attributeIndex: attributes.findIndex(
                  (attr) => attr.id === attribute.id,
                ),
              })),
            },
          },
        },
      });
      return result;
    },

    updateAttributes: async (
      attributes: Attribute[],
      idToUpdate: string | undefined,
      userId: string,
    ) => {
      if (!idToUpdate) {
        return null;
      }
      const attributeToUpdate = attributes.find(
        (attribute) => attribute.id === idToUpdate,
      );

      const result = await db.attribute.update({
        where: { id: idToUpdate, ownerId: userId },
        data: {
          ...attributeToUpdate,
        },
      });
      return result;
    },

    deleteAttribute: async (
      surveyId: string,
      idToDelete: string | undefined,
      userId: string,
    ) => {
      if (!idToDelete) {
        return null;
      }

      await db.attributesOnSurveys.deleteMany({
        where: {
          surveyId,
          attributeId: idToDelete,
        },
      });

      const attribute = await db.attribute.findUnique({
        where: { id: idToDelete },
      });

      if (attribute?.ownerId === userId) {
        await db.attribute.delete({
          where: { id: idToDelete },
        });
      }
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
            deleteMany: {},
          },
        },
      });

      const attributesOnSurveys = attributes.map((attribute, index) => ({
        attributeId: attribute.id,
        attributeIndex: index,
      }));

      const result = await db.survey.update({
        where: { id: surveyId, ownerId: userId },
        data: {
          attributes: {
            createMany: {
              data: attributesOnSurveys,
            },
          },
        },
      });

      return result;
    },

    addPropertiesToSurvey: async (
      surveyId: string,
      propertyIds: string[],
      userId: string,
    ) => {
      const survey = await db.survey.update({
        where: { id: surveyId, ownerId: userId },
        data: { properties: { connect: propertyIds.map((id) => ({ id })) } },
      });
      return survey;
    },

    updatePropertiesOrder: async (
      propertyIds: string[],
      oldIndex: number,
      newIndex: number,
    ) => {
      const updatePromises = [];
      const increment = oldIndex < newIndex ? -1 : 1;
      for (let i = newIndex; i !== oldIndex; i += increment) {
        updatePromises.push(
          db.property.update({
            where: { id: propertyIds[i] },
            data: { displayIndex: i + increment },
          }),
        );
      }
      updatePromises.push(
        db.property.update({
          where: { id: propertyIds[oldIndex] },
          data: { displayIndex: newIndex },
        }),
      );

      // Execute all updates in a batch transaction
      await db.$transaction(updatePromises);
    },

    deleteSurvey: async (surveyId: string, userId: string) => {
      const survey = await db.survey.delete({
        where: { id: surveyId, ownerId: userId },
      });
      return survey;
    },
  };
};
