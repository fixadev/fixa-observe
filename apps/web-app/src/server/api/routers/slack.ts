import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { env } from "~/env";
import axios from "axios";
import { type PublicMetadata } from "@repo/types/src";
import { currentUser } from "~/helpers/useSelfHostedAuth";
import { ClerkService } from "@repo/services/src";
import { db } from "~/server/db";
import { SlackService } from "@repo/services/src/ee/slack";

const clerkService = new ClerkService(db);
const slackService = new SlackService();

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
          // new URLSearchParams({
          //   code: input.code,
          //   client_id: env.NEXT_PUBLIC_SLACK_CLIENT_ID,
          //   client_secret: env.SLACK_CLIENT_SECRET,
          //   redirect_uri: env.NEXT_PUBLIC_SLACK_REDIRECT_URI,
          // }).toString(),
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

        await clerkService.updatePrivateMetadata({
          orgId: ctx.orgId,
          metadata: {
            slackAccessToken: accessToken,
          },
        });
        await clerkService.updatePublicMetadata({
          orgId: ctx.orgId,
          metadata: {
            slackWebhookUrl: webhookUrl,
          },
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

  sendAnalyticsMessage: protectedProcedure
    .input(z.object({ message: z.string() }))
    .mutation(async ({ input }) => {
      await slackService.sendAnalyticsMessage({ message: input.message });
    }),
});
