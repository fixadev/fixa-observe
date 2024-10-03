import { type Building, type PrismaClient } from "@prisma/client";
import { type ImportBuildingsArray, } from "~/lib/building";

export const buildingService = ({
  db,
}: {
  db: PrismaClient;
}) => {
  return {
    createBuildings: async (
      input: ImportBuildingsArray,
      userId: string,
    ) => {
      const buildingsToCreate = input.map((building) => ({
        ...building,
        ownerId: userId,
      }));

      const createdBuildings = await db.building.createMany({
        data: buildingsToCreate,
      });

      const allBuildings = await db.building.findMany({
        where: {
          ownerId: userId,
          address: {
            in: buildingsToCreate.map((building) => building.address),
          },
        },
      });

      console.log({
        created: createdBuildings.count,
      });

      return allBuildings.map((building) => building.id);
    },

    getBuilding: async (
      buildingId: string,
      userId: string,
    ) => {
      const building = await db.building.findUnique({
        where: {
          id: buildingId,
          ownerId: userId,
        },
        include: {
          brochures: true,
        },
      });

      return building;
    },

    updateBuilding: async (
      building: Building,
      userId: string,
    ) => {
      const response = await db.building.update({
        where: {
          id: building.id,
          ownerId: userId,
        },
        data: {
          ...building,
          ownerId: userId,
        },
      });
      return response;
    },

    addOrReplaceBuildingPhoto: async (buildingId: string, photoUrl: string, userId: string) => {
      await db.building.update({
        where: {
          id: buildingId,
          ownerId: userId,
        },
        data: {
          photoUrl: photoUrl,
        },
      });
      return photoUrl;
    },

    deletePhotoUrlFromBuilding: async (
      buildingId: string,
      userId: string,
    ) => {
      const building = await db.building.findUnique({
        where: {
          id: buildingId,
          ownerId: userId,
        },
      });

      if (!building) {
        throw new Error("Building not found");
      }

      return db.building.update({
        where: {
          id: buildingId,
          ownerId: userId,
        },
        data: {
          photoUrl: null,
        },
      });
    },

    addBrochure: async (
      buildingId: string,
      brochureUrl: string,
      brochureTitle: string,
      userId: string,
    ) => {
      const response = await db.building.update({
        where: {
          id: buildingId,
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
      buildingId: string,
      brochureId: string,
      userId: string,
    ) => {
      const building = await db.building.findUnique({
        where: {
          id: buildingId,
          ownerId: userId,
        },
      });

      if (!building) {
        throw new Error("Building not found");
      }

      return db.building.update({
        where: {
          id: buildingId,
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

    deleteBuilding: async (
      buildingId: string,
      userId: string,
    ) => {
      const building = await db.building.findUnique({
        where: {
          id: buildingId,
          ownerId: userId,
        },
      });

      if (!building) {
        throw new Error("Building not found");
      }

      return db.building.delete({
        where: {
          id: buildingId,
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
