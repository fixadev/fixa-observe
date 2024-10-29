import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createProjectInput, updateProjectInput } from "~/lib/project";
import { db } from "~/server/db";
import { projectService } from "~/server/services/project";

const projectServiceInstance = projectService({ db });

export const projectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createProjectInput)
    .mutation(async ({ ctx, input }) => {
      return await projectServiceInstance.createProject(input, ctx.user.id);
    }),

  get: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await projectServiceInstance.getProject(
        input.projectId,
        ctx.user.id,
      );
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await projectServiceInstance.getProjectsByUser(ctx.user.id);
  }),

  updateName: protectedProcedure
    .input(updateProjectInput)
    .mutation(async ({ ctx, input }) => {
      return await projectServiceInstance.updateName(
        input.projectId,
        input.projectName,
        ctx.user.id,
      );
    }),

  delete: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await projectServiceInstance.delete(input.projectId, ctx.user.id);
    }),
});
