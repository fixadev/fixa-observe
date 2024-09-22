import { type PrismaClient } from "@prisma/client";
import { type CreateProjectInput } from "~/lib/types/project";

export const createProject = async (
  input: CreateProjectInput,
  db: PrismaClient,
) => {
  const { ownerId, projectName, outcomes } = input;
  const project = await db.project.create({
    data: {
      ownerId,
      name: projectName,
      possibleOutcomes: {
        create: outcomes,
      },
    },
  });
  return project;
};
