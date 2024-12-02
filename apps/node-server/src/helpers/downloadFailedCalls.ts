import { sqs } from "../utils/s3Client";
import fs from "fs";

export const downloadFailedCalls = async () => {
  const failedCalls = [];
  let continueFetching = true;

  while (continueFetching) {
    const response = await sqs.receiveMessage({
      QueueUrl:
        "https://sqs.us-east-1.amazonaws.com/195275634305/fixa-observe-dlq-prod",
      MaxNumberOfMessages: 10, // Get max messages per request
      WaitTimeSeconds: 5,
    });

    if (!response.Messages || response.Messages.length === 0) {
      continueFetching = false;
      continue;
    }

    // Parse and store each message
    for (const message of response.Messages) {
      try {
        const messageData = JSON.parse(message.Body || "{}");

        const { userId, ...rest } = messageData;

        failedCalls.push({
          ...rest,
        });
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    }
  }

  // Write to JSON file
  fs.writeFileSync("failed-calls.json", JSON.stringify(failedCalls, null, 2));

  console.log(
    `Downloaded ${failedCalls.length} failed calls to failed-calls.json`,
  );
  return failedCalls;
};

downloadFailedCalls();
