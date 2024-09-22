import { type PrismaClient } from "@prisma/client";
import { type CreateProjectInput } from "~/lib/types/project";

export const createProject = async (
  input: CreateProjectInput,
  userId: string,
  db: PrismaClient,
) => {
  const { projectName, outcomes } = input;
  const project = await db.project.create({
    data: {
      ownerId: userId,
      name: projectName,
      possibleOutcomes: {
        create: outcomes,
      },
    },
  });
  return project;
};
