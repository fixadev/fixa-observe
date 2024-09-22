import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { createProjectInput, updateProjectInput } from "~/lib/types/project";
import {
  getProject,
  createProject,
  updateProject,
} from "~/app/shared/services/projects";

export const projectRouter = createTRPCRouter({
  createProject: publicProcedure
    .input(createProjectInput)
    .mutation(async ({ ctx, input }) => {
      return await createProject(input, ctx.db);
    }),

  getProject: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await getProject(input.projectId, ctx.db);
    }),

  updateProject: publicProcedure
    .input(updateProjectInput)
    .mutation(async ({ ctx, input }) => {
      return await updateProject(
        input.projectId,
        input.projectName,
        input.outcomes,
        ctx.db,
      );
    }),
});
