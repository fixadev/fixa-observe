import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { env } from "~/env";
import axios from "axios";
import { type PublicMetadata } from "@repo/types/src";
import { currentUser } from "@clerk/nextjs/server";
import { UserService } from "@repo/services/src/user";
import { db } from "~/server/db";

const userService = new UserService(db);

export const slackRouter = createTRPCRouter({
  exchangeCode: protectedProcedure
    .input(
      z.object({
        code: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const response = await axios.post<{
          ok: boolean;
          access_token: string;
          incoming_webhook: {
            url: string;
          };
        }>(
          "https://slack.com/api/oauth.v2.access",
          new URLSearchParams({
            code: input.code,
            client_id: env.NEXT_PUBLIC_SLACK_CLIENT_ID,
            client_secret: env.SLACK_CLIENT_SECRET,
            redirect_uri: env.NEXT_PUBLIC_SLACK_REDIRECT_URI,
          }).toString(),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          },
        );

        console.log("================= RESPONSE ==============", response.data);

        if (!response.data.ok) {
          throw new Error("Failed to exchange code");
        }

        const accessToken = response.data.access_token;
        const webhookUrl = response.data.incoming_webhook.url;

        await userService.updatePrivateMetadata(ctx.user.id, {
          slackAccessToken: accessToken,
        });
        await userService.updatePublicMetadata(ctx.user.id, {
          slackWebhookUrl: webhookUrl,
        });

        return response.data;
      } catch (error) {
        console.error("Error exchanging code:", error);
        throw new Error("Failed to exchange code");
      }
    }),

  sendMessage: protectedProcedure
    .input(z.object({ message: z.any() }))
    .mutation(async ({ input }) => {
      const user = await currentUser();
      const webhookUrl = (user?.publicMetadata as PublicMetadata)
        .slackWebhookUrl;
      if (!webhookUrl) {
        throw new Error("Slack webhook URL not found");
      }

      await axios.post(webhookUrl, input.message);
    }),
});
