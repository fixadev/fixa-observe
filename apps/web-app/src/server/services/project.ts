import { type PrismaClient } from "@prisma/client";
import { type CreateProjectInput } from "../../lib/project";

export const projectService = ({
  db,
}: {
  db: PrismaClient;
}) => {
  return {
    createProject: async (
      input: CreateProjectInput,
      userId: string,
    ) => {
      const { projectName } = input;
      const project = await db.project.create({
        data: {
          ownerId: userId,
          name: projectName,
          // TODO: Add description
        },
      });
      return project;
    },

    updateProject: async (
      projectId: string,
      projectName: string,
      userId: string,
    ) => {
      const project = await db.project.update({
        where: { id: projectId, ownerId: userId },
        data: { name: projectName },
      });
      return project;
    },

    getProject: async (projectId: string, userId: string) => {
      const project = await db.project.findUnique({
        where: { id: projectId, ownerId: userId },
        include: {
          surveys: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return project;
    },

    validateUserOwnsProject: async (projectId: string, userId: string) => {
      const project = await db.project.findUnique({
        where: { id: projectId, ownerId: userId },
      });
      return project;
    },

    getProjectsByUser: async (userId: string | null) => {
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
    },

    deleteProject: async (projectId: string) => {
      const queries = [
        db.project.delete({
          where: { id: projectId },
        }),
      ];
      await db.$transaction(queries);
    },
  };
};
