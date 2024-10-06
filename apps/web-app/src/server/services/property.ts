import { type Property, type PrismaClient } from "@prisma/client";
import { type BrochureSchema, type CreatePropertySchema } from "~/lib/property";

export const propertyService = ({
  db,
}: {
  db: PrismaClient;
}) => {
  return {
    createProperties: async (
      input: CreatePropertySchema[],
      userId: string,
    ) => {

      const brochures = input.map(property => property.brochures[0] ?? []);
      const propertiesToCreate = input.map(({ brochures, ...property }) => ({
        ...property,
        ownerId: userId,
        attributes: property.attributes ?? {},
      }));

      const createdProperties = await db.property.createManyAndReturn({
        data: propertiesToCreate,
      });

      for (const [index, property] of createdProperties.entries()) {
        const brochure = brochures[index];
        if (property && brochure && !Array.isArray(brochure) && 
            typeof brochure.url === 'string' && typeof brochure.title === 'string') {
          await db.brochure.create({ 
            data: {
              ...brochure,
              propertyId: property.id,
              url: brochure.url,
              title: brochure.title,
            },
          }); 
        }
      }
      return createdProperties.map((property) => property.id);
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
          attributes: property.attributes ?? {},
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

      console.log("DELETE PROPERTY", propertyId);

      return db.property.delete({
        where: {
          id: propertyId,
          ownerId: userId,
        },
      });
    },

  };
};
