import { env } from "../env";
import { transcribeAndSaveCall } from "../services/observability";
import { AgentService } from "@repo/services/src/agent";
import { sqs } from "../clients/s3Client";
import { db } from "../db";
import axios from "axios";
import { Semaphore } from "../utils/semaphore";

const agentService = new AgentService(db);

async function processMessage(
  message: { Body?: string; ReceiptHandle?: string },
  queueUrl: string,
) {
  try {
    const data = JSON.parse(message.Body || "{}");
    const {
      callId,
      stereoRecordingUrl,
      agentId,
      createdAt,
      userId,
      metadata,
      saveRecording,
    } = data;

    if (!callId || !stereoRecordingUrl || !userId || !createdAt) {
      console.error("Missing required fields in message:", data);
      throw new Error("Missing required fields");
    }

    console.log("PROCESSING CALL", callId);

    // Upsert agent if it doesn't exist
    const agent = await agentService.upsertAgent({
      customerAgentId: agentId,
      userId,
    });

    let newStereoRecordingUrl = stereoRecordingUrl;

    // if (userId === "user_2pPJOFVVjZPXE8ho8CI68u5lSCf") {
    //   try {
    //     const result = await axios.post(
    //       "https://mike.11x.ai/api/v1/retrieval/recording",
    //       {
    //         agentId: agentId,
    //         callId,
    //       },
    //       {
    //         headers: {
    //           Authorization: `Bearer 40844265-bea1-4e08-98fb-8dbff46b9e03_2c02f0e1-1165-4092-ae49-9434f0e2e24e`,
    //         },
    //       },
    //     );
    //     console.log("AXIOS CALL RESULT", result.data);
    //     console.log(result.data.url);
    //     console.log("setting new stereo recording url to ", result.data.url);
    //     newStereoRecordingUrl = result.data.url;
    //   } catch (error) {
    //     console.error("Error getting recording from 11x", error);
    //     await sqs.sendMessage({
    //       QueueUrl:
    //         "https://sqs.us-east-1.amazonaws.com/195275634305/fixa-observe-11x-backlog",
    //       MessageBody: message.Body,
    //     });
    //     await sqs.deleteMessage({
    //       QueueUrl: queueUrl,
    //       ReceiptHandle: message.ReceiptHandle!,
    //     });
    //     console.log("sent message to 11x backlog");
    //     return;
    //   }
    // }

    const newCall = await transcribeAndSaveCall({
      callId,
      stereoRecordingUrl: newStereoRecordingUrl,
      createdAt: createdAt,
      agentId: agent.id,
      metadata,
      userId,
      saveRecording,
    });

    await sqs.deleteMessage({
      QueueUrl: queueUrl,
      ReceiptHandle: message.ReceiptHandle!,
    });
  } catch (error) {
    console.error("Error processing message:", error, message.Body);
  }
}

export async function startQueueConsumer() {
  const semaphore = new Semaphore(5);
  const queueUrl = env.SQS_QUEUE_URL!;
  const activeProcesses: Promise<void>[] = [];

  while (true) {
    try {
      // Clean up completed processes
      for (let i = activeProcesses.length - 1; i >= 0; i--) {
        const status = await Promise.race([
          activeProcesses[i],
          Promise.resolve("pending"),
        ]);
        if (status !== "pending") {
          activeProcesses.splice(i, 1);
        }
      }

      // Only fetch new messages if we have capacity
      if (activeProcesses.length < 5) {
        const response = await sqs.receiveMessage({
          QueueUrl: queueUrl,
          MaxNumberOfMessages: 5 - activeProcesses.length,
          WaitTimeSeconds: 5,
        });

        if (response.Messages) {
          for (const message of response.Messages) {
            await semaphore.acquire();
            const processPromise = processMessage(message, queueUrl).finally(
              () => {
                semaphore.release();
              },
            );
            activeProcesses.push(processPromise);
          }
        } else {
          console.log("No messages in queue");
        }
      }
    } catch (error) {
      console.error("Error processing queue:", error);
    }

    // Small delay to prevent tight loop
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
