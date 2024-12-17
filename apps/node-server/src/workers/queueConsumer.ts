import { env } from "../env";
import { transcribeAndSaveCall } from "../services/observability";
import { AgentService } from "@repo/services/src/agent";
import { sqs } from "../clients/s3Client";
import { db } from "../db";
import { AddCallToQueueProps } from "../services/aws";

const agentService = new AgentService(db);

// redeploy

export async function startQueueConsumer() {
  while (true) {
    const queueUrl = env.SQS_QUEUE_URL;
    try {
      const response = await sqs.receiveMessage({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 5,
        WaitTimeSeconds: 5,
      });

      if (response.Messages) {
        for (const message of response.Messages) {
          // Process message
          const data = JSON.parse(message.Body || "{}");
          const {
            callId,
            location,
            agentId,
            createdAt,
            userId,
            metadata,
            saveRecording,
          } = data;
          if (!callId || !location || !userId || !createdAt) {
            console.error("Missing required fields in message:", data);
            throw new Error("Missing required fields");
          }

          console.log("PROCESSING CALL", callId);

          // Upsert agent if it doesn't exist
          const agent = await agentService.upsertAgent({ agentId, userId });

          const newCall = await transcribeAndSaveCall({
            callId,
            audioUrl: location,
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
        }
      } else {
        console.log("No messages in queue");
      }
    } catch (error) {
      console.error("Error processing queue:", error);
    }
  }
}
