import { Call, CallResult, Test } from "@prisma/client";
import { env } from "../env";
import axios from "axios";

export const sendTestCompletedSlackMessage = async ({
  userId,
  test,
}: {
  userId: string;
  test: Test & { calls: Call[] };
}) => {
  console.log(
    "sending slack message =========================================================",
  );
  const user = await getUser(userId);
  console.log(user, "user");
  if (!user.public_metadata.slackWebhookUrl) {
    return;
  }

  const numCalls = test.calls.length;
  const numCallsSucceeded = test.calls.filter(
    (call) => call.result === CallResult.success,
  ).length;
  const emoji = numCallsSucceeded === numCalls ? ":white_check_mark:" : ":x:";
  const message = {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*test finished!*\n\n${emoji} ${numCallsSucceeded}/${numCalls} calls succeeded`,
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "view test",
            emoji: true,
          },
          url: `${process.env.NEXT_BASE_URL}/dashboard/${test.agentId}/tests/${test.id}`,
        },
      },
    ],
  };

  console.log(message);
  await axios.post(user.public_metadata.slackWebhookUrl, message);
};

interface PrivateMetadata {
  slackAccessToken?: string;
}

interface PublicMetadata {
  slackWebhookUrl?: string;
}
async function getUser(userId: string) {
  try {
    const response = await axios.get<{
      public_metadata: PublicMetadata;
      private_metadata?: PrivateMetadata;
    }>(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user from Clerk:", error);
    throw error;
  }
}
