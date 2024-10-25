import { Prisma, type PrismaClient } from "@prisma/client";
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
import { attributesService } from "./attributes";
import { formatAddresses } from "../utils/formatAddresses";

export const surveyService = ({ db }: { db: PrismaClient }) => {
  const propertyServiceInstance = propertyService({ db });
  const attributesServiceInstance = attributesService({ db });

  const addProperties = async (
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
    addProperties,

    get: async (surveyId: string, userId: string) => {
      const survey = await db.survey.findUnique({
        where: { id: surveyId, ownerId: userId },
        include: {
          columns: {
            include: {
              attribute: true,
            },
          },
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

    create: async (input: CreateSurveyInput, userId: string) => {
      const attributes =
        await attributesServiceInstance.getDefaultAttributes(userId);
      const survey = await db.survey.create({
        data: {
          name: input.surveyName,
          projectId: input.projectId,
          ownerId: userId,
          columns: {
            createMany: {
              data: attributes.map((attribute, index) => ({
                attributeId: attribute.id,
                displayIndex: index,
              })),
            },
          },
        },
      });
      return survey;
    },

    update: async (surveyData: SurveySchema, userId: string) => {
      const result = await db.survey.update({
        where: { id: surveyData.id, ownerId: userId },
        data: { ...surveyData },
      });
      return result;
    },

    delete: async (surveyId: string, userId: string) => {
      const survey = await db.survey.delete({
        where: { id: surveyId, ownerId: userId },
      });
      return survey;
    },

    createColumn: async (input: {
      surveyId: string;
      attributeId: string;
      displayIndex: number;
      userId: string;
    }) => {
      const survey = await db.survey.update({
        where: { id: input.surveyId, ownerId: input.userId },
        data: {
          columns: {
            create: {
              attributeId: input.attributeId,
              displayIndex: input.displayIndex,
            },
          },
        },
      });
      return survey;
    },

    updateColumnsOrder: async (
      columnIds: string[],
      oldIndex: number,
      newIndex: number,
    ) => {
      const updatePromises = [];
      const increment = oldIndex < newIndex ? -1 : 1;
      for (let i = newIndex; i !== oldIndex; i += increment) {
        updatePromises.push(
          db.column.update({
            where: { id: columnIds[i] },
            data: { displayIndex: i + increment },
          }),
        );
      }
      updatePromises.push(
        db.column.update({
          where: { id: columnIds[oldIndex] },
          data: { displayIndex: newIndex },
        }),
      );

      // Execute all updates in a batch transaction
      await db.$transaction(updatePromises);
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

        const existingColumns = await db.column.findMany({
          where: { surveyId },
        });

        const allAttributes = await attributesServiceInstance.getAll(ownerId);
        // figure out what attributes exist + what attributes are default visible
        const defaultVisibleAttributes = allAttributes.filter(
          (attribute) => attribute.defaultVisible,
        );
        const optionalAttributesToInclude = allAttributes
          .filter((attribute) => !attribute.defaultVisible)
          .filter((attribute) =>
            parsedProperties.some(
              (property) =>
                (property as Record<string, unknown>)[attribute.label] !== null,
            ),
          );

        // deduplicate attributes
        const attributesToCreate = [
          ...defaultVisibleAttributes,
          ...optionalAttributesToInclude,
        ].filter(
          (attribute) =>
            !existingColumns.some(
              (column) => column.attributeId === attribute.id,
            ),
        );

        // create a column for each attribute -- use default index
        const newColumns = await db.column.createManyAndReturn({
          data: attributesToCreate.map((attribute) => ({
            attributeId: attribute.id,
            displayIndex: attribute.defaultIndex,
            surveyId,
          })),
        });

        const allColumns = [...existingColumns, ...newColumns];

        // const relevantAttributes = {
        //   address: property.postalAddress ?? "",
        //   buildingName: property.buildingName ?? "",
        //   suite: property.suite ?? "",
        //   size: property.availSpace ?? "",
        //   divisibility:
        //     `${property.minDivisible} - ${property.maxDivisible}` ?? "",
        //   askingRate: property.leaseRate ?? "",
        //   opEx: property.expenses ?? "",
        //   directSublease: property.leaseType ?? "",
        //   comments: property.comments ?? "",
        // }

        // create a property for each parsed property
        const propertiesToCreate: Array<CreatePropertySchema> =
          parsedProperties.map((property, index) => {
            return {
              createdAt: new Date(),
              updatedAt: new Date(),
              photoUrl: property.photoUrl,
              displayIndex: index,
              surveyId: surveyId,
              brochureUrl: property.brochureLink ?? "",
            };
          });

        const createdProperties =
          await propertyServiceInstance.createManyWithBrochures(
            propertiesToCreate,
            ownerId,
          );

        // populate attributes for each property

        const formattedAddresses = await formatAddresses(
          input.map((property) => ({
            addressString: property.attributes.address ?? "",
            suite: property.attributes.suite ?? "",
            buildingName: property.attributes.buildingName ?? "",
          })),
        );

        await addProperties(surveyId, createdIds, ownerId);

        return { status: 200 };
      } catch (error) {
        console.error("Error importing NDX PDF", error);
        return { status: 500 };
      }
    },
  };
};
