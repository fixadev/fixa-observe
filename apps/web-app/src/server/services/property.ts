import { type Prisma, type PrismaClient } from "@prisma/client";
import {
  type CreatePropertySchema,
  type PropertySchema,
  type CreateEmptyPropertySchema,
} from "~/lib/property";
import { env } from "~/env";

export const propertyService = ({ db }: { db: PrismaClient }) => {
  return {
    create: async (input: CreateEmptyPropertySchema) => {
      const property = await db.property.create({
        data: {
          displayIndex: input.displayIndex,
          ownerId: input.ownerId,
          surveyId: input.surveyId,
        },
      });
      return property.id;
    },

    get: async (propertyId: string, userId: string) => {
      const property = await db.property.findUnique({
        where: {
          id: propertyId,
          ownerId: userId,
        },
        include: {
          brochures: true,
          emailThreads: true,
        },
      });

      return property;
    },

    update: async (property: PropertySchema, userId: string) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { brochures, ...propertyData } = property;
      const response = await db.property.update({
        where: {
          id: property.id,
          ownerId: userId,
        },
        data: {
          ...propertyData,
          ownerId: userId,
        },
      });
      return response;
    },

    updateValue: async (
      propertyId: string,
      columnId: string,
      value: string,
    ) => {
      // Upsert the property value - create if doesn't exist, update if it does
      return await db.propertyValue.upsert({
        where: {
          propertyId_columnId: {
            propertyId,
            columnId,
          },
        },
        create: {
          propertyId,
          columnId,
          value,
        },
        update: {
          value,
        },
      });
    },

    updateAddress: async (propertyId: string, address: string) => {
      return await db.property.update({
        where: { id: propertyId },
        data: { address },
      });
    },

    delete: async (propertyId: string, userId: string) => {
      const property = await db.property.findUnique({
        where: {
          id: propertyId,
          ownerId: userId,
        },
      });

      if (!property) {
        throw new Error("Property not found");
      }

      return db.property.delete({
        where: {
          id: propertyId,
          ownerId: userId,
        },
      });
    },

    createManyWithBrochures: async (
      input: CreatePropertySchema[],
      userId: string,
    ) => {
      const propertiesToCreate = input.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ brochureUrl, ...property }) => ({
          ...property,
          ownerId: userId,
        }),
      );

      const createdProperties = await db.property.createManyAndReturn({
        data: propertiesToCreate,
      });

      const brochuresToCreate: Prisma.BrochureCreateManyInput[] = input
        .map((property, index) => {
          if (property.brochureUrl) {
            return {
              createdAt: new Date(),
              updatedAt: new Date(),
              url: property.brochureUrl,
              propertyId: createdProperties[index]?.id ?? "",
              inpaintedRectangles: [],
              textToRemove: [],
              pathsToRemove: [],
              undoStack: [],
              deletedPages: [],
              exportedUrl: null,
              title: "",
              approved: false,
            };
          }
          return null;
        })
        .filter((brochure) => brochure !== null);

      if (brochuresToCreate.length > 0) {
        const createdBrochures = await db.brochure.createManyAndReturn({
          data: brochuresToCreate,
        });

        const brochuresToParse = createdBrochures.map((brochure) => ({
          url: brochure.url,
          propertyId: brochure.propertyId,
          id: brochure.id,
        }));

        // parse brochures in the background
        void fetch(`${env.NEXT_PUBLIC_API_URL}/api/parse-brochures`, {
          method: "POST",
          body: JSON.stringify({ brochures: brochuresToParse }),
        });
      }

      return createdProperties.map((property) => property.id);
    },

    setPhoto: async (propertyId: string, photoUrl: string, userId: string) => {
      await db.property.update({
        where: {
          id: propertyId,
          ownerId: userId,
        },
        data: {
          photoUrl: photoUrl,
        },
      });
      return photoUrl;
    },

    deletePhoto: async (propertyId: string, userId: string) => {
      const property = await db.property.findUnique({
        where: {
          id: propertyId,
          ownerId: userId,
        },
      });

      if (!property) {
        throw new Error("Property not found");
      }

      return db.property.update({
        where: {
          id: propertyId,
          ownerId: userId,
        },
        data: {
          photoUrl: null,
        },
      });
    },
  };
};
