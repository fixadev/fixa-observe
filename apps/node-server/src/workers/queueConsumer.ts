import { env } from "../env";
import { analyzeAndSaveCall } from "../services/observability/observability";
import { AgentService } from "@repo/services/src/agent";
import { sqs } from "../clients/s3Client";
import { db } from "../db";
import { Semaphore } from "../utils/semaphore";
import { UploadCallParams } from "@repo/types/src/index";
import axios from "axios";

const agentService = new AgentService(db);

async function processMessage(
  message: { Body?: string; ReceiptHandle?: string },
  queueUrl: string,
) {
  try {
    const data: UploadCallParams = JSON.parse(message.Body || "{}");
    const {
      callId,
      stereoRecordingUrl,
      agentId,
      createdAt,
      ownerId,
      metadata,
      saveRecording,
      language,
      scenario,
      webhookUrl,
    } = data;
    if (!callId || !stereoRecordingUrl || !ownerId || !createdAt) {
      console.error("Missing required fields in message:", data);
      throw new Error("Missing required fields");
    }

    console.log("PROCESSING CALL", callId);

    // Upsert agent if it doesn't exist
    const agent = await agentService.upsertAgent({
      customerAgentId: agentId,
      ownerId,
    });

    const call = await analyzeAndSaveCall({
      callId,
      stereoRecordingUrl,
      createdAt: createdAt,
      agentId: agent.id,
      metadata,
      ownerId,
      saveRecording,
      language,
      scenario,
    });

    if (webhookUrl) {
      await axios.post(webhookUrl, {
        success: true,
        call,
        url: `https://fixa.dev/observe/${call.id}`,
      });
    }

    await sqs.deleteMessage({
      QueueUrl: queueUrl,
      ReceiptHandle: message.ReceiptHandle!,
    });
  } catch (error) {
    console.error("Error processing message:", error, message.Body);
  }
}

async function runQueueConsumer() {
  const semaphore = new Semaphore(5);
  const queueUrl = env.SQS_QUEUE_URL!;

  while (true) {
    try {
      const response = await sqs.receiveMessage({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 5,
      });
      if (response.Messages) {
        for (const message of response.Messages) {
          await semaphore.acquire();
          processMessage(message, queueUrl).finally(() => {
            semaphore.release();
          });
        }
      } else {
        console.log("No messages in queue");
      }
    } catch (error) {
      console.error("Error consuming queue:", error);
    }
  }
}
// comment
export async function startQueueConsumer() {
  while (true) {
    try {
      console.log("Starting queue consumer...");
      await runQueueConsumer();
    } catch (error) {
      console.error("Queue consumer crashed, restarting in 5 seconds:", error);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}
