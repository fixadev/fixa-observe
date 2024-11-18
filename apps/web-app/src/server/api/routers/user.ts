import { createTRPCRouter, protectedProcedure } from "../trpc";
import { userService } from "~/server/services/user";
import { generateApiKey } from "~/lib/utils";

export const userRouter = createTRPCRouter({
  generateApiKey: protectedProcedure.mutation(async ({ ctx }) => {
    // Generate a random API key
    const apiKey = generateApiKey();

    // Store the API key in the user's private metadata
    await userService.updatePrivateMetadata(ctx.user.id, {
      apiKey,
    });

    return { apiKey };
  }),

  getApiKey: protectedProcedure.query(async ({ ctx }) => {
    const metadata = await userService.getPrivateMetadata(ctx.user.id);
    return { apiKey: metadata.apiKey };
  }),
});
