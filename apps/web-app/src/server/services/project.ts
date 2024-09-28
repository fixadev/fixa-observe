import { type PrismaClient } from "@prisma/client";
import { type CreateProjectInput } from "../../lib/project";

export const createProject = async (
  input: CreateProjectInput,
  userId: string,
  db: PrismaClient,
) => {
  const { projectName } = input;
  const project = await db.project.create({
    data: {
      ownerId: userId,
      name: projectName,
    },
  });
  return project;
};

export const updateProject = async (
  projectId: string,
  projectName: string,
  userId: string,
  db: PrismaClient,
) => {
  const project = await db.project.update({
    where: { id: projectId, ownerId: userId },
    data: { name: projectName },
  });
  return project;
};

export const getProject = async (projectId: string, db: PrismaClient) => {
  const project = await db.project.findUnique({
    where: { id: projectId },
  });
  return project;
};

export const validateUserOwnsProject = async (projectId: string, userId: string, db: PrismaClient) => {

  const project = await db.project.findUnique({
    where: { id: projectId, ownerId: userId },
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
    db.project.delete({
      where: { id: projectId },
    }),
  ];
  await db.$transaction(queries);
};
