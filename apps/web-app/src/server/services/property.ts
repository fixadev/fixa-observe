import { type Prisma, type PrismaClient } from "@prisma/client";
import {
  type BrochureSchema,
  type CreatePropertySchema,
  type BrochureWithoutPropertyId,
  type PropertySchema,
} from "~/lib/property";
import { extractContactInfo } from "../utils/extractContactInfo";
import { formatAddresses } from "../utils/formatAddresses";
import { env } from "~/env";

export const propertyService = ({ db }: { db: PrismaClient }) => {
  async function extractAndUploadContactInfo(
    brochureUrl: string,
    propertyId: string,
    userId: string,
  ) {
    const contactInfo = await extractContactInfo(brochureUrl);
    return await db.property.update({
      where: {
        id: propertyId,
        ownerId: userId,
      },
      data: {
        contacts: {
          createMany: {
            data: contactInfo ?? [],
          },
        },
      },
    });
  }

  async function createBrochure(
    propertyId: string,
    brochure: BrochureWithoutPropertyId,
    userId: string,
  ) {
    // do this in the background
    void extractAndUploadContactInfo(brochure.url, propertyId, userId);
    const response = await db.property.update({
      where: {
        id: propertyId,
        ownerId: userId,
      },
      data: {
        brochures: {
          deleteMany: {},
          create: [
            {
              ...brochure,
              approved: false,
              inpaintedRectangles: [],
              textToRemove: [],
              pathsToRemove: [],
            },
          ],
        },
      },
    });
    return response;
  }

  return {
    createProperties: async (input: CreatePropertySchema[], userId: string) => {
      const startTime = new Date();
      const formattedAddresses = await formatAddresses(
        input.map((property) => property.attributes.address ?? ""),
      );
      const brochures: (BrochureWithoutPropertyId | null)[] = input.map(
        (property) => property.brochures[0] ?? null,
      );

      const propertiesToCreate = input.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ brochures, ...property }, index) => ({
          ...property,
          ownerId: userId,
          attributes:
            {
              ...property.attributes,
              address: formattedAddresses
                ? formattedAddresses[index]?.address
                : "",
              displayAddress: formattedAddresses
                ? formattedAddresses[index]?.displayAddress
                : "",
            } ?? {},
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

    getProperty: async (propertyId: string, userId: string) => {
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

    updateProperty: async (property: PropertySchema, userId: string) => {
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
          attributes: property.attributes ?? {},
        },
      });
      return response;
    },

    setPropertyPhoto: async (
      propertyId: string,
      photoUrl: string,
      userId: string,
    ) => {
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

    deletePropertyPhoto: async (propertyId: string, userId: string) => {
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

    createBrochure,

    getBrochure: async (brochureId: string, userId: string) => {
      const brochure = await db.brochure.findUnique({
        where: {
          id: brochureId,
          property: {
            ownerId: userId,
          },
        },
      });
      return brochure;
    },

    updateBrochure: async (brochure: BrochureSchema, userId: string) => {
      const response = await db.brochure.update({
        where: {
          id: brochure.id,
          property: {
            ownerId: userId,
          },
        },
        data: {
          ...brochure,
          inpaintedRectangles: brochure.inpaintedRectangles ?? [],
          textToRemove: brochure.textToRemove ?? [],
          pathsToRemove: brochure.pathsToRemove ?? [],
        },
      });
      return response;
    },

    updateBrochureUrl: async (
      brochureId: string,
      url: string,
      userId: string,
    ) => {
      return db.brochure.update({
        where: {
          id: brochureId,
        },
        data: {
          url,
        },
      });
    },

    deleteBrochure: async (
      propertyId: string,
      brochureId: string,
      userId: string,
    ) => {
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
          brochures: {
            delete: {
              id: brochureId,
            },
          },
        },
      });
    },

    deleteProperty: async (propertyId: string, userId: string) => {
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
  };
};
