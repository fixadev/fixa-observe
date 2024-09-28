import { type Building, type PrismaClient } from "@prisma/client";
import { type ImportBuildingsInput } from "~/lib/building";


export const createOrUpdateBuildings = async (
  input: ImportBuildingsInput,
  userId: string,
  db: PrismaClient,
) => {

    const existingBuildings = await db.building.findMany({
        where: {
            ownerId: userId,
        },
    });

    const buildingsToCreate = input.filter(building => !existingBuildings.some(existing => existing.name === building.name));
    const buildingsToUpdate = input.filter(building => existingBuildings.some(existing => existing.name === building.name));

    const createdBuildings = await db.building.createMany({
        data: buildingsToCreate.map(building => ({
            ...building,
            ownerId: userId,    
        })),
    });

    const updatedBuildings = await db.building.updateMany({
        where: {
            ownerId: userId,
        },
        data: buildingsToUpdate.map(building => ({
            ...building,
            ownerId: userId,
        })),
    });

    return {
        created: createdBuildings.count,
        updated: updatedBuildings.count,
    };

};

export const getBuildingDetails = async (buildingId: string, userId: string, db: PrismaClient) => {
    const building = await db.building.findUnique({
        where: {
            id: buildingId,
            ownerId: userId,
        },
    });
    
    return building;
};

export const updateBuildingDetails = async (building: Building, userId: string, db: PrismaClient) => {
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

export const addPhotosToBuilding = async (buildingId: string, photoUrls: string[], userId: string, db: PrismaClient) => {
    const response = await db.building.update({
        where: {
            id: buildingId,
            ownerId: userId,
        },
        data: {
            photoUrls,
        },
    });
    return response;
};

