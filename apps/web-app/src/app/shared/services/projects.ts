import { type PrismaClient } from "@prisma/client";
import { type CreateProjectInput } from "~/lib/types/project";
import { type OutcomeInput } from "~/lib/types/project";

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
  console.log("UPDATING PROJECT with outcomes", outcomes);
  const project = await db.project.update({
    where: { id: projectId, ownerId: userId },
    data: { name: projectName, possibleOutcomes: { create: outcomes } },
  });
  console.log("PROJECT UPDATED", project);
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
      clerkId: userId ?? "",
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
