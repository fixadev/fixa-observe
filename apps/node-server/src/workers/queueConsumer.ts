import { env } from "../env";
import { parseMetadata } from "../helpers/parseMetadata";
import { transcribeAndSaveCall } from "../services/transcribeAndSaveCall";
import { upsertAgent } from "../services/upsertAgent";
import { sqs } from "../utils/s3Client";

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
            regionId,
            createdAt,
            userId,
            metadata,
          } = data;
          if (!callId || !location || !userId || !createdAt) {
            console.error("Missing required fields in message:", data);
            throw new Error("Missing required fields");
          }

          const {
            regionId: newRegionId,
            agentId: newAgentId,
            metadata: newMetadata,
          } = parseMetadata(metadata);

          // Upsert agent if it doesn't exist
          const agent = await upsertAgent(agentId || newAgentId, userId);

          const newCall = await transcribeAndSaveCall(
            callId,
            location,
            createdAt,
            agent.id,
            regionId || newRegionId,
            newMetadata,
          );
          console.log("Transcription completed:", newCall);

          await sqs.deleteMessage({
            QueueUrl: queueUrl,
            ReceiptHandle: message.ReceiptHandle!,
          });
        }
      } else {
        // console.log("No messages in queue");
      }
    } catch (error) {
      console.error("Error processing queue:", error);
    }
  }
}
