import { SQS } from "@aws-sdk/client-sqs";
import { env } from "../env";

const sqs = new SQS({
  region: "us-east-1",
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
  },
});
const queueUrl =
  "https://sqs.us-east-1.amazonaws.com/195275634305/fixa-observe-prod";

interface AddCallToQueueProps {
  callId: string;
  location: string;
  agentId: string;
  regionId: string;
}

export const addCallToQueue = async (input: AddCallToQueueProps) => {
  // Send message
  await sqs
    .sendMessage({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(input),
    })
    .then((res) => {
      console.log(res);
    });
};
