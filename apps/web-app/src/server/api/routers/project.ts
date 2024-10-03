import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createProjectInput, updateProjectInput } from "~/lib/project";
import { db } from "~/server/db";
import { projectService } from "~/server/services/project";

const projectServiceInstance = projectService({ db });

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(createProjectInput)
    .mutation(async ({ ctx, input }) => {
      return await projectServiceInstance.createProject(input, ctx.userId);
    }),

  getProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await projectServiceInstance.getProject(input.projectId);
    }),

  getProjects: protectedProcedure.query(async ({ ctx }) => {
    return await projectServiceInstance.getProjectsByUser(ctx.userId);
  }),

  updateProject: protectedProcedure
    .input(updateProjectInput)
    .mutation(async ({ ctx, input }) => {
      return await projectServiceInstance.updateProject(
        input.projectId,
        input.projectName,
        ctx.userId,
      );
    }),
});
