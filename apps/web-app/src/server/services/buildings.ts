import { type Space, type Building, type PrismaClient } from "@prisma/client";
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
    // Filter out buildings that already exist in the db -- TODO: find some cleaner way to do this
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

    const allBuildings = await db.building.findMany({
        where: {
            ownerId: userId,
            name: {
                in: [...buildingsToCreate.map(building => building.name), ...buildingsToUpdate.map(building => building.name)],
            },
        },
    });

    console.log({
        created: createdBuildings.count,
        updated: updatedBuildings.count,
    });

    return [...allBuildings].map(building => building.id).filter(id => id !== undefined);
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

export const addPhotoUrlsToBuilding = async (buildingId: string, photoUrls: string[], userId: string, db: PrismaClient) => {
    return db.building.update({
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
};


export const deletePhotoUrlFromBuilding = async (buildingId: string, photoUrl: string, userId: string, db: PrismaClient) => {
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
                set: building.photoUrls.filter(url => url !== photoUrl),
            },
        },
    });
};

export const addAttachmentToBuilding = async (buildingId: string, attachmentUrl: string, attachmentType: string, attachmentTitle: string, userId: string, db: PrismaClient) => {
    const response = await db.building.update({
        where: {
            id: buildingId,
            ownerId: userId,
        },
        data: {
            attachments: {
                create: [{
                    url: attachmentUrl,
                    title: attachmentTitle,
                    type: attachmentType,
                }],
            },
        },
    });
    return response;
};


export const deleteAttachmentFromBuilding = async (buildingId: string, attachmentId: string, userId: string, db: PrismaClient) => {
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


export const deleteBuilding = async (buildingId: string, userId: string, db: PrismaClient) => {
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


export const createSpace = async (buildingId: string, space: Space, userId: string, db: PrismaClient) => {
    return db.building.update({
        where: {
            id: buildingId,
            ownerId: userId,
        },
        data: {
            spaces: {   
                create: {
                    ...space
                },
            },
        },
    });
};

export const updateSpace = async (buildingId: string, space: Space, userId: string, db: PrismaClient) => {
    return db.building.update({
        where: {
            id: buildingId,
            ownerId: userId,
        },
        data: {
            spaces: {   
                update: [{
                    where: { id: space.id },
                    data: {
                        ...space,
                    },
                }],
            },
        },
    });
};


export const deleteSpace = async (buildingId: string, spaceId: string, userId: string, db: PrismaClient) => {
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

