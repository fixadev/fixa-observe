import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createProjectInput, updateProjectInput } from "@repo/project-domain/types/project";
import {
  getProject,
  createProject,
  updateProject,
  getProjectsByUser,
} from "@repo/project-domain/services/project";

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

  getProjectsByUser: protectedProcedure.query(async ({ ctx }) => {
    return await getProjectsByUser(ctx.userId, ctx.db);
  }),

  updateProject: protectedProcedure
    .input(updateProjectInput)
    .mutation(async ({ ctx, input }) => {
      console.log("Updating project with input", input);
      return await updateProject(
        input.projectId,
        input.projectName,
        input.outcomes,
        ctx.userId,
        ctx.db,
      );
    }),
});
