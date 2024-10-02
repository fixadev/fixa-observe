import { type Space, type Building, type PrismaClient } from "@prisma/client";
import { type ImportBuildingsArray, } from "~/lib/building";

export const createOrUpdateBuildings = async (
  input: ImportBuildingsArray,
  userId: string,
  db: PrismaClient,
) => {
  const existingBuildings = await db.building.findMany({
    where: {
      ownerId: userId,
    },
  });
  // Filter out buildings that already exist in the db -- TODO: find some cleaner way to do this
  const buildingsToCreate = input
    .filter(
      (building) =>
        !existingBuildings.some(
          (existing) => existing.address === building.address,
        ),
    )
    .map((building) => ({
      ...building,
      ownerId: userId,
    }));

  const buildingsToUpdate = input
    .filter((building) =>
      existingBuildings.some(
        (existing) => existing.address === building.address,
      ),
    )
    .map((building) => ({
      ...building,
      ownerId: userId,
      id: existingBuildings.find(
        (existing) => existing.address === building.address,
      )?.id,
    }));

  let createdCount = 0;
  if (buildingsToCreate.length > 0) {
    const createdBuildings = await db.building.createMany({
      data: buildingsToCreate,
    });
    createdCount = createdBuildings.count;
  }

  let updatedCount = 0;
  if (buildingsToUpdate.length > 0) {
    for (const building of buildingsToUpdate) {
      await db.building.update({
        where: {
          id: building.id,
        },
        data: {
          address: building.address,
          attributes: building.attributes,
        },
      });
      updatedCount++;
    }
  }

  const allBuildings = await db.building.findMany({
    where: {
      ownerId: userId,
      address: {
        in: [
          ...buildingsToCreate.map((building) => building.address),
          ...buildingsToUpdate.map((building) => building.address),
        ],
      },
    },
  });

  console.log({
    created: createdCount,
    updated: updatedCount,
  });

  return [...allBuildings]
    .map((building) => building.id)
    .filter((id) => id !== undefined);
};

export const getBuildingDetails = async (
  buildingId: string,
  userId: string,
  db: PrismaClient,
) => {
  const building = await db.building.findUnique({
    where: {
      id: buildingId,
      ownerId: userId,
    },
    include: {
      attachments: true,
      spaces: true,
    },
  });

  return building;
};

export const updateBuildingDetails = async (
  building: Building,
  userId: string,
  db: PrismaClient,
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
};

export const addPhotoUrlsToBuilding = async (buildingId: string, photoUrls: string[], userId: string, db: PrismaClient) => {
    await db.building.update({
        where: {
            id: buildingId,
            ownerId: userId,
        },
        data: {
            photoUrls: {
                push: photoUrls,
            },
        },
    });
    return photoUrls;
};

export const deletePhotoUrlFromBuilding = async (
  buildingId: string,
  photoUrl: string,
  userId: string,
  db: PrismaClient,
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
      photoUrls: {
        set: building.photoUrls.filter((url) => url !== photoUrl),
      },
    },
  });
};

export const addAttachmentToBuilding = async (
  buildingId: string,
  attachmentUrl: string,
  attachmentType: string,
  attachmentTitle: string,
  userId: string,
  db: PrismaClient,
) => {
  const response = await db.building.update({
    where: {
      id: buildingId,
      ownerId: userId,
    },
    data: {
      attachments: {
        create: [
          {
            url: attachmentUrl,
            title: attachmentTitle,
            type: attachmentType,
          },
        ],
      },
    },
  });
  return response;
};

export const deleteAttachmentFromBuilding = async (
  buildingId: string,
  attachmentId: string,
  userId: string,
  db: PrismaClient,
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
      attachments: {
        delete: {
          id: attachmentId,
        },
      },
    },
  });
};

export const deleteBuilding = async (
  buildingId: string,
  userId: string,
  db: PrismaClient,
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
};

export const createSpace = async (
  buildingId: string,
  space: Space,
  userId: string,
  db: PrismaClient,
) => {
  return db.building.update({
    where: {
      id: buildingId,
      ownerId: userId,
    },
    data: {
      spaces: {
        create: {
          ...space,
        },
      },
    },
  });
};

export const updateSpace = async (
  buildingId: string,
  space: Space,
  userId: string,
  db: PrismaClient,
) => {
  return db.building.update({
    where: {
      id: buildingId,
      ownerId: userId,
    },
    data: {
      spaces: {
        update: [
          {
            where: { id: space.id },
            data: {
              ...space,
            },
          },
        ],
      },
    },
  });
};

export const deleteSpace = async (
  buildingId: string,
  spaceId: string,
  userId: string,
  db: PrismaClient,
) => {
  return db.building.update({
    where: {
      id: buildingId,
      ownerId: userId,
    },
    data: {
      spaces: {
        delete: {
          id: spaceId,
        },
      },
    },
  });
};

export const getAttributes = async (userId: string, db: PrismaClient) => {
  return db.attribute.findMany({
    where: {
      OR: [{ ownerId: userId }, { ownerId: null }],
    },
  });
};
