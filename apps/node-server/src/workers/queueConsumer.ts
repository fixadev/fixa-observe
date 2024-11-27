import { env } from "../env";
import { transcribeAndSaveCall } from "../services/transcribeAndSaveCall";
import { uploadCallToDB } from "../services/uploadCallToDB";
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
          const { callId, location, agentId, regionId, createdAt } = data;
          if (!callId || !location || !agentId || !regionId) {
            console.error("Missing required fields in message:", data);
            throw new Error("Missing required fields");
          }
          // Add your processing logic here
          const result = await uploadCallToDB(
            callId,
            location,
            agentId,
            regionId,
            createdAt,
          );

          const newCall = await transcribeAndSaveCall(
            callId,
            result.audioUrl,
            result.createdAt,
            agentId,
            regionId,
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
