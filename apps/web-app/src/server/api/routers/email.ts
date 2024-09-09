import { sendEmail } from "~/server/listmonk";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const emailRouter = createTRPCRouter({
  sendServerIsDownEmail: publicProcedure.mutation(async ({ ctx }) => {
    // Find if there's a serverIsDownEmail in the last 1 hour
    const serverIsDownEmail = await ctx.db.serverIsDownEmail.findFirst({
      where: {
        createdAt: {
          gte: new Date(new Date().getTime() - 1 * 60 * 60 * 1000),
        },
      },
    });
    if (serverIsDownEmail) {
      return;
    }

    await sendEmail(["jonathan@pixa.dev", "oliver@pixa.dev"], "serverIsDown");

    await ctx.db.serverIsDownEmail.create({
      data: {},
    });
  }),

  serverBackUp: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.db.serverIsDownEmail.deleteMany({});
  }),
});
