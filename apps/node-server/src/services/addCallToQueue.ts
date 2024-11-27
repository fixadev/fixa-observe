import { sqs } from "../utils/s3Client";
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
