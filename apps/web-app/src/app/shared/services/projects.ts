import { type PrismaClient } from "@prisma/client";
import { type CreateProjectInput } from "~/lib/types/project";
import { type OutcomeInput } from "~/lib/types/project";

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

export const updateProject = async (
  projectId: string,
  projectName: string,
  outcomes: OutcomeInput[],
  db: PrismaClient,
) => {
  const project = await db.project.update({
    where: { id: projectId },
    data: { name: projectName, possibleOutcomes: { create: outcomes } },
  });
  return project;
};

export const getProject = async (projectId: string, db: PrismaClient) => {
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: { possibleOutcomes: true, conversations: true },
  });
  return project;
};
