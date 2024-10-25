import { type PrismaClient } from "@prisma/client";

export const attributesService = ({ db }: { db: PrismaClient }) => {
  const getDefaultAttributes = async (userId: string) => {
    return db.attribute.findMany({
      where: {
        OR: [{ ownerId: userId }, { ownerId: null }],
      },
      orderBy: {
        defaultIndex: "asc",
      },
    });
  };

  return {
    createAttribute: async (
      attributeLabel: string,
      defaultIndex: number,
      userId: string,
    ) => {
      return db.attribute.create({
        data: {
          ownerId: userId,
          label: attributeLabel,
          defaultIndex,
          type: "string",
        },
      });
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
  };
};
