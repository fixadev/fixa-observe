import axios from "axios";
import { sqs } from "../../clients/s3Client";

export async function updateRecordings() {
  while (true) {
    try {
      const response = await sqs.receiveMessage({
        QueueUrl:
          "https://sqs.us-east-1.amazonaws.com/195275634305/fixa-observe-dlq-prod",
        MaxNumberOfMessages: 5,
        WaitTimeSeconds: 5,
      });
      if (!response.Messages) {
        console.log("No messages found");
        return;
      }
      console.log(`Received ${response.Messages.length} messages`);

      for (const message of response.Messages) {
        const messageBody = JSON.parse(message.Body!);
        const response = await axios.post(
          "https://mike.11x.ai/api/v1/retrieval/recording",
          {
            agentId: messageBody.agentId,
            callId: messageBody.callId,
          },
          {
            headers: {
              Authorization: `Bearer 40844265-bea1-4e08-98fb-8dbff46b9e03_2c02f0e1-1165-4092-ae49-9434f0e2e24e`,
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
          console.error("Error updating recording:", response.data);
        }
      }
    } catch (error) {
      console.error("Error updating recordings:", error);
    }
  }
}

updateRecordings();
