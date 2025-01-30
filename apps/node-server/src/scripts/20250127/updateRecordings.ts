import axios from "axios";
import { sqs } from "../../clients/s3Client";

export async function updateRecordings() {
  while (true) {
    const response = await sqs.receiveMessage({
      QueueUrl:
        "https://sqs.us-east-1.amazonaws.com/195275634305/fixa-observe-dlq-prod",
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 5,
    });
    if (!response.Messages) {
      console.log("No messages found");
      return;
    }
    console.log(`Received ${response.Messages.length} messages`);

    // Process messages in parallel
    await Promise.all(
      response.Messages.map(async (message) => {
        const messageBody = JSON.parse(message.Body!);
        try {
          const response = await axios.post(
            "https://mike.11x.ai/api/v1/retrieval/recording",
            {
              agentId: messageBody.agentId,
              callId: messageBody.callId,
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.X_API_KEY}`,
              },
            },
          );
          if (response.status === 200) {
            console.log("Successfully retrieved recording", response.data);
            const updatedMessageBody = {
              ...messageBody,
              stereoRecordingUrl: response.data.url,
            };
            await sqs
              .sendMessage({
                QueueUrl:
                  "https://sqs.us-east-1.amazonaws.com/195275634305/fixa-observe-prod",
                MessageBody: JSON.stringify(updatedMessageBody),
              })
              .then(() => {
                console.log("Successfully sent message");
              })
              .catch((error) => {
                console.error("Error sending message:", error);
              });
          } else {
            await sqs
              .sendMessage({
                QueueUrl:
                  "https://sqs.us-east-1.amazonaws.com/195275634305/fixa-observe-11x-backlog",
                MessageBody: JSON.stringify(messageBody),
              })
              .then(() => {
                console.log("Sent message to 11x backlog");
              })
              .catch((error) => {
                console.error("Error sending message:", error);
              });
          }
        } catch (error) {
          await sqs
            .sendMessage({
              QueueUrl:
                "https://sqs.us-east-1.amazonaws.com/195275634305/fixa-observe-11x-backlog",
              MessageBody: JSON.stringify(messageBody),
            })
            .then(() => {
              console.log("Sent message to 11x backlog");
            })
            .catch((error) => {
              console.error("Error sending message:", error);
            });
        }
      }),
    );
  }
}

updateRecordings();
