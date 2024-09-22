import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { createProjectInput, updateProjectInput } from "~/lib/types/project";
import { createProject } from "~/app/shared/services/createProject";
import { getProject } from "~/app/shared/services/getProject";
import { updateProject } from "~/app/shared/services/updateProject";
import { getProjectsByUser } from "~/app/shared/services/getProjectsByUser";


export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure.input(createProjectInput).mutation(async ({ ctx, input }) => {
    return await createProject(input, ctx.auth.userId, ctx.db);
  }),

  getProject: protectedProcedure.input(z.object({ projectId: z.string() })).query(async ({ ctx, input }) => {
    return await getProject(input.projectId, ctx.auth.userId, ctx.db);
  }),

  getProjectsByUser: protectedProcedure.query(async ({ ctx }) => {
    return await getProjectsByUser(ctx.auth.userId, ctx.db);
  }),

  updateProject: protectedProcedure.input(updateProjectInput).mutation(async ({ ctx, input }) => {
    return await updateProject(input.projectId, input.projectName, input.outcomes, ctx.auth.userId, ctx.db);
  }),
 
});
