import { transcribeAndSaveCall } from "../services/transcribeAndSaveCall";
import { uploadCallToDB } from "../services/uploadCallToDB";
import { sqs } from "../utils/s3Client";

export async function startQueueConsumer() {
  while (true) {
    try {
      const response = await sqs.receiveMessage({
        QueueUrl: process.env.SQS_QUEUE_URL,
        MaxNumberOfMessages: 5,
        WaitTimeSeconds: 20,
      });

      if (response.Messages) {
        for (const message of response.Messages) {
          // Process message
          const data = JSON.parse(message.Body || "{}");
          const { callId, location, agentId, regionId } = data;
          if (!callId || !location || !agentId || !regionId) {
            throw new Error("Missing required fields");
          }
          // Add your processing logic here
          const result = await uploadCallToDB(
            callId,
            location,
            agentId,
            regionId,
          );
          const newCall = await transcribeAndSaveCall(
            callId,
            result.audioUrl,
            result.createdAt,
            agentId,
            regionId,
          );

          // Delete message after processing
          await sqs.deleteMessage({
            QueueUrl: process.env.SQS_QUEUE_URL,
            ReceiptHandle: message.ReceiptHandle!,
          });
        }
      }
    } catch (error) {
      console.error("Error processing queue:", error);
    }
  }
}
