import { type PrismaClient } from "@prisma/client";

export const attributesService = ({ db }: { db: PrismaClient }) => {
  return {
    getDefaults: async (userId: string) => {
      return db.attribute.findMany({
        where: {
          OR: [
            { ownerId: userId, defaultVisible: true },
            { ownerId: null, defaultVisible: true },
          ],
        },
        orderBy: {
          defaultIndex: "asc",
        },
      });
    },

    getAll: async (userId: string) => {
      return db.attribute.findMany({
        where: {
          OR: [{ ownerId: userId }, { ownerId: null }],
        },
        orderBy: {
          defaultIndex: "asc",
        },
      });
    },

    get: async (id: string) => {
      return db.attribute.findUnique({
        where: { id },
      });
    },

    create: async (
      attributeLabel: string,
      defaultIndex: number,
      userId: string,
    ) => {
      return db.attribute.create({
        data: {
          ownerId: userId,
          label: attributeLabel,
          defaultIndex,
        },
      });
    },

    delete: async (idToDelete: string | undefined, userId: string) => {
      if (!idToDelete) {
        return null;
      }

      const attribute = await db.attribute.findUnique({
        where: { id: idToDelete },
      });

      if (attribute?.ownerId === userId) {
        await db.attribute.delete({
          where: { id: idToDelete },
        });
      }
    },
  };
};
