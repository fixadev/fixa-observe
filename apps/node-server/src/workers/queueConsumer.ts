import { env } from "../env";
import { transcribeAndSaveCall } from "../services/observability";
import { upsertAgent } from "../services/agent";
import { sqs } from "../clients/s3Client";

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
          const { callId, location, agentId, createdAt, userId, metadata } =
            data;
          if (!callId || !location || !userId || !createdAt) {
            console.error("Missing required fields in message:", data);
            throw new Error("Missing required fields");
          }

          console.log("PROCESSING CALL", callId);

          // Upsert agent if it doesn't exist
          const agent = await upsertAgent(agentId, userId);

          const newCall = await transcribeAndSaveCall({
            callId,
            audioUrl: location,
            createdAt,
            agentId: agent.id,
            metadata,
            userId,
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
