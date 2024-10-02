import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createProjectInput, updateProjectInput } from "~/lib/project";
import {
  getProject,
  createProject,
  updateProject,
  getProjectsByUser,
} from "~/server/services/project";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(createProjectInput)
    .mutation(async ({ ctx, input }) => {
      return await createProject(input, ctx.userId, ctx.db);
    }),

  getProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await getProject(input.projectId, ctx.db);
    }),

  getProjects: protectedProcedure.query(async ({ ctx }) => {
    return await getProjectsByUser(ctx.userId, ctx.db);
  }),

  updateProject: protectedProcedure
    .input(updateProjectInput)
    .mutation(async ({ ctx, input }) => {
      return await updateProject(
        input.projectId,
        input.projectName,
        ctx.userId,
        ctx.db,
      );
    }),
});
