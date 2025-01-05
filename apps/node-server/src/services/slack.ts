import { Call, CallResult, Test } from "@prisma/client";
import { env } from "../env";
import axios from "axios";
import {
  Agent,
  Alert,
  EvalSetAlert,
  LatencyAlert,
} from "@repo/types/src/index";
import { clerkServiceClient } from "../clients/clerkServiceClient";
import { db } from "../db";

export const sendTestCompletedSlackMessage = async ({
  orgId,
  test,
}: {
  orgId: string;
  test: Test & { calls: Call[] };
}) => {
  console.log(
    "sending slack message =========================================================",
  );
  const metadata = await clerkServiceClient.getPublicMetadata({
    orgId,
  });
  console.log(metadata, "metadata");
  if (!metadata.slackWebhookUrl) {
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
  await axios.post(metadata.slackWebhookUrl, message);
};

export async function getEvaluationSetName(alert: Alert) {
  const evaluationSet = await db.evaluationGroup.findUnique({
    where: {
      id: (alert.details as EvalSetAlert).evalSetId,
    },
  });
  return evaluationSet?.name;
}

export const sendAlertSlackMessage = async ({
  ownerId,
  call,
  success,
  alert,
}: {
  ownerId: string;
  call: Call & { agent: Agent | null };
  success: boolean;
  alert: Omit<Alert, "details"> & { details: LatencyAlert | EvalSetAlert };
}) => {
  console.log(
    "sending slack message =========================================================",
  );
  const metadata = await clerkServiceClient.getPublicMetadata({
    orgId: ownerId,
  });
  if (!metadata.slackWebhookUrl) {
    return;
  }

  const emoji =
    alert.type === "latency"
      ? ":stopwatch:"
      : success
        ? ":white_check_mark:"
        : ":x:";

  const message =
    alert.type === "latency"
      ? {
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `${emoji} latency ${
                  (alert.details as LatencyAlert).percentile
                } exceeded ${
                  (alert.details as LatencyAlert).threshold
                }ms over the last ${
                  (alert.details as LatencyAlert).lookbackPeriod.label
                }`,
              },
              accessory: {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "view saved search",
                  emoji: true,
                },
                url: `${process.env.NEXT_BASE_URL}/observe/saved/${alert.savedSearchId}`,
              },
            },
          ],
        }
      : {
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `${emoji} evaluation *${await getEvaluationSetName(
                  alert,
                )}* ${success ? "succeeded" : "failed"} \n\n agent: ${call.agentId} ${call.agent?.name ? `(${call.agent?.name})` : ""} \n\n callId: ${call.customerCallId}`,
              },
              accessory: {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "view call",
                  emoji: true,
                },
                url: `${process.env.NEXT_BASE_URL}/observe/calls/${call.id}`,
              },
            },
          ],
        };
  await axios.post(metadata.slackWebhookUrl, message);
};
