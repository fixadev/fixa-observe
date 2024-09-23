import { type PrismaClient } from "@prisma/client";
import { type CreateProjectInput } from "../types/project";
import { type OutcomeInput } from "../types/project";

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

export const updateProject = async (
  projectId: string,
  projectName: string,
  outcomes: OutcomeInput[],
  userId: string,
  db: PrismaClient,
) => {
  const existingOutcomes = outcomes.filter(o => o.id);
  const newOutcomes = outcomes.filter(o => !o.id);

  const project = await db.project.update({
    where: { id: projectId, ownerId: userId },
    data: {
      name: projectName,
      possibleOutcomes: {
        deleteMany: {
          id: { 
            notIn: existingOutcomes.map(o => o.id).filter((id): id is string => id !== null && id !== undefined)
          },
        },
        update: existingOutcomes.map(outcome => ({
          where: { id: outcome.id },
          data: { name: outcome.name, description: outcome.description },
        })),
        create: newOutcomes.map(outcome => ({
          name: outcome.name,
          description: outcome.description,
        })),
      },
    },
    include: { possibleOutcomes: true },
  });
  return project;
};

export const getProject = async (projectId: string, db: PrismaClient) => {
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: { possibleOutcomes: true, conversations: false },
  });
  return project;
};

export const getProjectsByUser = async (
  userId: string | null,
  db: PrismaClient,
) => {
  const user = await db.user.findUnique({
    where: {
      id: userId ?? "",
    },
    include: {
      projects: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return user?.projects ?? [];
};

export const deleteProject = async (projectId: string, db: PrismaClient) => {
  const queries = [
    db.outcome.deleteMany({
      where: { projectId: projectId },
    }),
    db.conversation.deleteMany({
      where: { projectId: projectId },
    }),
    db.project.delete({
      where: { id: projectId },
    }),
  ];
  await db.$transaction(queries);
};
