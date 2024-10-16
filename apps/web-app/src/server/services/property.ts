import { type PrismaClient } from "@prisma/client";
import axios from "axios";
import {
  type BrochureSchema,
  type CreatePropertySchema,
  type BrochureWithoutPropertyId,
  type PropertySchema,
  type BrochureRectangles,
  type BrochureRectanglesByPage,
} from "~/lib/property";
import { extractContactInfo } from "../utils/extractContactInfo";
import { formatAddresses } from "../utils/formatAddresses";
import { env } from "~/env";

export const propertyService = ({ db }: { db: PrismaClient }) => {
  async function createBrochure(
    propertyId: string,
    brochure: BrochureWithoutPropertyId,
    userId: string,
  ) {
    console.log("creating brochure in property service", brochure);
    const contactInfo = await extractContactInfo(brochure.url);
    console.log("contactInfo", contactInfo);
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
              inpaintedRectangles: brochure.inpaintedRectangles ?? [],
            },
          ],
        },
        contacts: {
          createMany: {
            data: contactInfo ?? [],
          },
        },
      },
    });
    return response;
  }

  return {
    createProperties: async (input: CreatePropertySchema[], userId: string) => {
      const formattedAddresses = await formatAddresses(
        input.map((property) => property.attributes.address ?? ""),
      );
      const brochures = input.map((property) => property.brochures[0] ?? []);

      const propertiesToCreate = input.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ brochures, ...property }, index) => ({
          ...property,
          ownerId: userId,
          attributes:
            {
              ...property.attributes,
              address: formattedAddresses ? formattedAddresses[index] : "",
            } ?? {},
        }),
      );

      const createdProperties = await db.property.createManyAndReturn({
        data: propertiesToCreate,
      });

      for (const [index, property] of createdProperties.entries()) {
        const brochure = brochures[index];
        if (
          property &&
          brochure &&
          !Array.isArray(brochure) &&
          typeof brochure.url === "string" &&
          typeof brochure.title === "string"
        ) {
          await createBrochure(property.id, brochure, userId);
        }
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
        },
      });
      return response;
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

    inpaintRectangles: async (input: BrochureRectangles) => {
      try {
        const data = await db.brochure.findUnique({
          where: {
            id: input.brochureId,
          },
        });

        const response = await axios.post<{newRectangles: BrochureRectanglesByPage }>(
          `${env.INPAINTING_SERVICE_URL}/inpaint`,
          {
            brochureUrl: data?.url,
            rectanglesToRemoveByPage: input.pageData,
        });

        if (response.status === 200) {
          const newRectangles = response.data.newRectangles;
          console.log("newRectangles", newRectangles);
          if (newRectangles !== undefined && newRectangles !== null) {
          return await db.brochure.update({
            where: { id: input.brochureId },
            data: { inpaintedRectangles: newRectangles },
          })
        }
        } else {  
          throw new Error("Failed to inpaint rectangles");
        }
      
      } catch (error) {
        console.error('Error removing objects:', error);
        throw error;
      }
    },
  };
};
