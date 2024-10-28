import { type PrismaClient } from "@prisma/client";
import axios from "axios";
import { env } from "~/env";
import { type CreatePropertySchema } from "~/lib/property";
import { type CreateSurveyInput } from "~/lib/survey";
import { type SurveySchema } from "~/lib/survey";
import { propertyService } from "./property";
import { parsePropertyCardWithAI } from "../utils/parsePropertyCardWithAI";
import { attributesService } from "./attributes";
import { advancedParseFloat } from "~/app/parseNumbers";

export const surveyService = ({ db }: { db: PrismaClient }) => {
  const propertyServiceInstance = propertyService({ db });
  const attributesServiceInstance = attributesService({ db });

  return {
    get: async (surveyId: string, userId: string) => {
      const survey = await db.survey.findUnique({
        where: { id: surveyId, ownerId: userId },
        include: {
          columns: {
            include: {
              attribute: true,
            },
            orderBy: {
              displayIndex: "asc",
            },
          },
          properties: {
            include: {
              propertyValues: true,
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
      const attributes = await attributesServiceInstance.getDefaults(userId);
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
      const survey = await db.$transaction(async (tx) => {
        await tx.column.deleteMany({
          where: { surveyId },
        });
        await tx.propertyValue.deleteMany({
          where: { property: { surveyId } },
        });
        return await tx.survey.delete({
          where: { id: surveyId, ownerId: userId },
        });
      });
      return survey;
    },

    createColumn: async (input: {
      surveyId: string;
      attributeId: string;
      displayIndex: number;
    }) => {
      const column = await db.column.create({
        data: {
          attributeId: input.attributeId,
          displayIndex: input.displayIndex,
          surveyId: input.surveyId,
        },
      });
      return column;
    },

    updateColumnAttribute: async (
      columnId: string,
      attributeId: string,
      userId: string,
    ) => {
      const column = await db.column.update({
        where: { id: columnId, survey: { ownerId: userId } },
        data: { attributeId },
      });
      return column;
    },

    deleteColumn: async (columnId: string, userId: string) => {
      const column = await db.column.delete({
        where: { id: columnId, survey: { ownerId: userId } },
      });
      return column;
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

    importNDXPDF: async (input: {
      surveyId: string;
      pdfUrl: string;
      selectedAttributeIds: string[];
      ownerId: string;
    }) => {
      try {
        const response = await axios.post(
          `${env.SCRAPING_SERVICE_URL}/extract-ndx-pdf`,
          {
            pdfUrl: input.pdfUrl,
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
              brochureUrl: property.link ?? undefined,
              photoUrl: property.image_url,
            };
          }),
        );

        // create a property for each parsed property
        const propertiesToCreate: Array<CreatePropertySchema> =
          parsedProperties.map((property, index) => {
            return {
              address: property.displayAddress ?? "",
              createdAt: new Date(),
              updatedAt: new Date(),
              photoUrl: property.photoUrl,
              displayIndex: index,
              surveyId: input.surveyId,
              brochureUrl: property.brochureUrl ?? "",
            };
          });

        const createdPropertyIds =
          await propertyServiceInstance.createManyWithBrochures(
            propertiesToCreate,
            input.ownerId,
          );

        const propertiesWithIds = createdPropertyIds.map((id, index) => ({
          ...parsedProperties[index],
          totalCost:
            "$" +
            Math.round(
              advancedParseFloat(parsedProperties[index]?.availSpace ?? "0") *
                (advancedParseFloat(parsedProperties[index]?.leaseRate ?? "0") +
                  advancedParseFloat(parsedProperties[index]?.expenses ?? "0")),
            ).toString(),
          brochureUrl: undefined,
          photoUrl: undefined,
          postalAddress: undefined,
          buildingName: undefined,
          minDivisible: undefined,
          maxDivisible: undefined,
          id,
        }));

        const selectedAttributes = await attributesServiceInstance.getSelected(
          input.selectedAttributeIds,
        );

        const existingColumns = await db.column.findMany({
          where: { surveyId: input.surveyId },
        });

        // deduplicate columns
        const columnsToCreate = selectedAttributes.filter(
          (attribute) =>
            !existingColumns.some(
              (column) => column.attributeId === attribute.id,
            ),
        );

        // create a column for each attribute -- use default index
        const newColumns = await db.column.createManyAndReturn({
          data: columnsToCreate.map((attribute) => ({
            attributeId: attribute.id,
            displayIndex: attribute.defaultIndex,
            surveyId: input.surveyId,
          })),
        });

        const allColumns = [...existingColumns, ...newColumns];

        const propertyValuesToCreate = propertiesWithIds.flatMap((property) =>
          Object.entries(property)
            .map(([key, value]) => {
              const columnId = allColumns.find(
                (column) =>
                  selectedAttributes.find(
                    (attribute) => attribute.id === column.attributeId,
                  )?.id === key,
              )?.id;

              return columnId
                ? {
                    propertyId: property.id,
                    columnId: columnId,
                    value: value ? String(value) : "",
                  }
                : null;
            })
            .filter(
              (entry): entry is NonNullable<typeof entry> => entry !== null,
            ),
        );

        await db.propertyValue.createMany({
          data: propertyValuesToCreate,
        });

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

        // populate attributes for each property

        return { status: 200 };
      } catch (error) {
        console.error("Error importing NDX PDF", error);
        return { status: 500 };
      }
    },
  };
};
