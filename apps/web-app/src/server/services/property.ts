import { type Prisma, type PrismaClient } from "@prisma/client";
import {
  type CreatePropertySchema,
  type PropertySchema,
  type CreateEmptyPropertySchema,
} from "~/lib/property";
import { type BrochureWithoutPropertyId } from "~/lib/brochure";
import { formatAddresses } from "../utils/formatAddresses";
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

    createMany: async (input: CreatePropertySchema[], userId: string) => {
      const startTime = new Date();
      const formattedAddresses = await formatAddresses(
        input.map((property) => ({
          addressString: property.attributes.address ?? "",
          suite: property.attributes.suite ?? "",
          buildingName: property.attributes.buildingName ?? "",
        })),
      );
      const brochures: (BrochureWithoutPropertyId | null)[] = input.map(
        (property) => property.brochures[0] ?? null,
      );

      const propertiesToCreate = input.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ brochures, ...property }, index) => ({
          ...property,
          ownerId: userId,
          attributes: {
            ...property.attributes,
            address: formattedAddresses?.[index]?.address ?? "",
            displayAddress: formattedAddresses?.[index]?.displayAddress ?? "",
          },
        }),
      );

      const createdProperties = await db.property.createManyAndReturn({
        data: propertiesToCreate,
      });

      const endTime = new Date();
      console.log(
        "===============TIME TO CREATE PROPERTIES===============",
        endTime.getTime() - startTime.getTime(),
      );

      const brochuresToCreate: Prisma.BrochureCreateManyInput[] = brochures
        .map((brochure, index) => {
          if (brochure) {
            return {
              propertyId: createdProperties[index]?.id ?? "",
              ...brochure,
              inpaintedRectangles: [],
              textToRemove: [],
              pathsToRemove: [],
              exportedUrl: null,
            };
          }
          return null;
        })
        .filter((brochure) => brochure !== null);

      if (brochuresToCreate.length > 0) {
        const createdBrochures = await db.brochure.createManyAndReturn({
          data: brochuresToCreate,
        });
        const endTime2 = new Date();
        console.log(
          "===============TIME TO CREATE BROCHURES===============",
          endTime2.getTime() - startTime.getTime(),
        );

        const brochuresToParse = createdBrochures.map((brochure) => ({
          url: brochure.url,
          propertyId: brochure.propertyId,
          id: brochure.id,
        }));

        const endTime3 = new Date();

        console.log(
          "===============SENDING REQUEST TO PARSE BROCHURES===============",
          endTime3.getTime() - startTime.getTime(),
        );

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
