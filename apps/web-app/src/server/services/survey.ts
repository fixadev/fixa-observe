import { type PrismaClient } from "@prisma/client";
import axios from "axios";
import { env } from "~/env";
import {
  type CreatePropertySchema,
  type AttributeSchema,
} from "~/lib/property";
import { type CreateSurveyInput } from "~/lib/survey";
import { type SurveySchema } from "~/lib/survey";
import { propertyService } from "./property";
import { parsePropertyCardWithAI } from "../utils/parsePropertyCardWithAI";

export const surveyService = ({ db }: { db: PrismaClient }) => {
  const propertyServiceInstance = propertyService({ db });

  const getAttributes = async (userId: string) => {
    return db.attribute.findMany({
      where: {
        OR: [{ ownerId: userId }, { ownerId: null }],
      },
      orderBy: {
        defaultIndex: "asc",
      },
    });
  };

  const addPropertiesToSurvey = async (
    surveyId: string,
    propertyIds: string[],
    userId: string,
  ) => {
    const survey = await db.survey.update({
      where: { id: surveyId, ownerId: userId },
      data: { properties: { connect: propertyIds.map((id) => ({ id })) } },
    });
    return survey;
  };

  return {
    getAttributes,

    addPropertiesToSurvey,

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
      const attributes = await getAttributes(userId);
      const survey = await db.survey.create({
        data: {
          name: input.surveyName,
          projectId: input.projectId,
          ownerId: userId,
          attributes: {
            createMany: {
              data: attributes.map((attribute, index) => ({
                attributeId: attribute.id,
                attributeIndex: index,
              })),
            },
          },
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
      attributes: AttributeSchema[],
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
      attributes: AttributeSchema[],
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
      attributes: AttributeSchema[],
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
      attributes: AttributeSchema[],
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

    importNDXPDF: async (surveyId: string, pdfUrl: string, ownerId: string) => {
      try {
        const response = await axios.post(
          `${env.SCRAPING_SERVICE_URL}/extract-ndx-pdf`,
          {
            pdfUrl,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        const properties = response.data as Array<{
          image_url: string;
          text: string;
          link: string | undefined;
        }>;

        const parsedProperties = await Promise.all(
          properties.map(async (property) => {
            const parsedProperty = await parsePropertyCardWithAI(property.text);
            return {
              ...parsedProperty,
              brochureLink: property.link ?? undefined,
              photoUrl: property.image_url,
            };
          }),
        );

        const propertiesWithAttributes: Array<CreatePropertySchema> =
          parsedProperties.map((property, index) => {
            return {
              createdAt: new Date(),
              updatedAt: new Date(),
              photoUrl: property.photoUrl,
              brochures: property.brochureLink
                ? [
                    {
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      url: property.brochureLink,
                      title: "",
                      approved: false,
                      exportedUrl: null,
                      inpaintedRectangles: [],
                      textToRemove: [],
                      pathsToRemove: [],
                      undoStack: [],
                      deletedPages: [],
                    },
                  ]
                : [],
              displayIndex: index,
              surveyId: surveyId,
              attributes: {
                address: property.postalAddress ?? "",
                buildingName: property.buildingName ?? "",
                suite: property.suite ?? "",
                size: property.availSpace ?? "",
                divisibility:
                  `${property.minDivisible} - ${property.maxDivisible}` ?? "",
                askingRate: property.leaseRate ?? "",
                opEx: property.expenses ?? "",
                directSublease: property.leaseType ?? "",
                comments: property.comments ?? "",
              },
            };
          });

        const propertiesToCreate = propertiesWithAttributes
          .filter(
            (property) => typeof property === "object" && !("id" in property),
          )
          .map((property) => ({
            ...property,
            ownerId,
          }));
        // console.log("PROPERTIES TO CREATE", propertiesToCreate);
        const propertyIds = await propertyServiceInstance.createProperties(
          propertiesToCreate,
          ownerId,
        );
        await addPropertiesToSurvey(surveyId, propertyIds, ownerId);

        return { status: 200 };
      } catch (error) {
        console.error("Error importing NDX PDF", error);
        return { status: 500 };
      }
    },
  };
};
