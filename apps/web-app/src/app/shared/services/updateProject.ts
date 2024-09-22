import { type PrismaClient } from "@prisma/client";
import { type OutcomeInput } from "~/lib/types/project";

export const updateProject = async (projectId: string, projectName: string, outcomes: OutcomeInput[], db: PrismaClient) => {
    const project = await db.project.update({
        where: { id: projectId },
        data: { name: projectName, possibleOutcomes: { create: outcomes } },
    });
    return project;
}
