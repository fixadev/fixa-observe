import { env } from "../env";
import { parseMetadata } from "../helpers/parseMetadata";
import { transcribeAndSaveCall } from "../services/transcribeAndSaveCall";
import { uploadCallRecordingToDB } from "../services/uploadCallToDB";
import { upsertAgent } from "../services/upsertAgent";
import { sqs } from "../utils/s3Client";

export async function startQueueConsumer() {
  while (true) {
    console.log("queueUrl", env.SQS_QUEUE_URL);
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
          if (!callId || !location || !agentId || !regionId || !userId) {
            console.error("Missing required fields in message:", data);
            throw new Error("Missing required fields");
          }

          // Upsert agent if it doesn't exist
          const agent = await upsertAgent(agentId, userId);

          const {
            regionId: newRegionId,
            agentId: newAgentId,
            metadata: newMetadata,
          } = parseMetadata(metadata);

          const newCall = await transcribeAndSaveCall(
            callId,
            location,
            createdAt,
            agentId || newAgentId,
            regionId || newRegionId,
          );
          console.log("Transcription completed:", newCall);

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
