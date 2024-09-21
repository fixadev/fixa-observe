import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { createProjectInput, outcomeInput } from "~/lib/types/project";

export const projectRouter = createTRPCRouter({
  createProject: publicProcedure.input(createProjectInput).mutation(async ({ ctx, input }) => {
    const { userId, projectName, outcomes } = input;

    const project = await ctx.db.project.create({
      data: {
        userId,
        name: projectName,
        possibleOutcomes: {
          create: outcomes,
        },
      },
    });
    return project;
  }),

  getProject: publicProcedure.input(z.object({ projectId: z.string() })).query(async ({ ctx, input }) => {
    const { projectId } = input;

    const project = await ctx.db.project.findUnique({
      where: { id: projectId },
      include: { possibleOutcomes: true },
    });

    return project;
  }),

  updateOutcomes: publicProcedure.input(z.object({ projectId: z.string(), outcomes: z.array(outcomeInput) })).mutation(async ({ ctx, input }) => {
    const { projectId, outcomes } = input;

    const project = await ctx.db.project.update({
      where: { id: projectId },
      data: { possibleOutcomes: { create: outcomes } },
    });

    return project;
  }),

 
});
