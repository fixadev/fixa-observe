import { type PrismaClient } from "@prisma/client";
import { type CreateProjectInput } from "~/lib/types/project";

export const createProject = async (input: CreateProjectInput, db: PrismaClient) => {
    const { userId, projectName, outcomes } = input
    const project = await db.project.create({
      data: {
        userId,
        name: projectName,
        possibleOutcomes: {
          create: outcomes,
        },
      },
    });
    return project;
  }