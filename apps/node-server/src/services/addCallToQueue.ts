import { env } from "../env";
import { sqs } from "../utils/s3Client";

interface AddCallToQueueProps {
  callId: string;
  location: string;
  agentId: string;
  regionId: string;
  createdAt: Date;
  userId: string;
  metadata: Record<string, string>;
}

export const addCallToQueue = async (input: AddCallToQueueProps) => {
  // Send message

  await sqs
    .sendMessage({
      QueueUrl: env.SQS_QUEUE_URL,
      MessageBody: JSON.stringify(input),
    })
    .then((res) => {
      console.log(res);
    });
};
