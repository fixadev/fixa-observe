import { type Property, type PrismaClient } from "@prisma/client";
import { type ImportPropertiesArray, } from "~/lib/property";

export const propertyService = ({
  db,
}: {
  db: PrismaClient;
}) => {
  return {
    createProperties: async (
      input: ImportPropertiesArray,
      userId: string,
    ) => {
      const propertiesToCreate = input.map((property) => ({
        ...property,
        ownerId: userId,
      }));

      const createdProperties = await db.property.createMany({
        data: propertiesToCreate,
      });

      const allProperties = await db.property.findMany({
        where: {
          ownerId: userId,
          address: {
            in: propertiesToCreate.map((property) => property.address),
          },
        },
      });

      console.log({
        created: createdProperties.count,
      });

      return allProperties.map((property) => property.id);
    },

    getProperty: async (
      propertyId: string,
      userId: string,
    ) => {
      const property = await db.property.findUnique({
        where: {
          id: propertyId,
          ownerId: userId,
        },
        include: {
          brochures: true,
        },
      });

      return property;
    },

    updateProperty: async (
      property: Property,
      userId: string,
    ) => {
      const response = await db.property.update({
        where: {
          id: property.id,
          ownerId: userId,
        },
        data: {
          ...property,
          ownerId: userId,
        },
      });
      return response;
    },

    addOrReplacePropertyPhoto: async (propertyId: string, photoUrl: string, userId: string) => {
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

    deletePhotoUrlFromProperty: async (
      propertyId: string,
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
          photoUrl: null,
        },
      });
    },

    addBrochure: async (
      propertyId: string,
      brochureUrl: string,
      brochureTitle: string,
      userId: string,
    ) => {
      const response = await db.property.update({
        where: {
          id: propertyId,
          ownerId: userId,
        },
        data: {
          brochures: {
            create: [
              {
                url: brochureUrl,
                title: brochureTitle,
              },
            ],
          },
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

    deleteProperty: async (
      propertyId: string,
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

      return db.property.delete({
        where: {
          id: propertyId,
          ownerId: userId,
        },
      });
    },

    getAttributes: async (userId: string) => {
      return db.attribute.findMany({
        where: {
          OR: [{ ownerId: userId }, { ownerId: null }],
        },
      });
    },
  };
};
