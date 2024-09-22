import { type PrismaClient } from "@prisma/client";
import { type OutcomeInput } from "~/lib/types/project";

export const updateProject = async (projectId: string, projectName: string, outcomes: OutcomeInput[], userId: string, db: PrismaClient) => {
    const project = await db.project.update({
        where: { id: projectId, ownerId: userId },
        data: { name: projectName, possibleOutcomes: { create: outcomes } },
    });
    return project;
}
