import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createProjectInput, updateProjectInput } from "~/lib/project";
import { db } from "~/server/db";

export const attributeRouter = createTRPCRouter({
  createAttribute: protectedProcedure
    .input(z.object({ label: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return {
        status: 200,
      };
    }),
});
