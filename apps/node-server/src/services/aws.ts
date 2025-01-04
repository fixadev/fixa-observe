import { env } from "../env";
import { sqs } from "../clients/s3Client";
import { s3 } from "../clients/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { UploadCallParams } from "@repo/types/src/types";
import { randomUUID } from "crypto";

export const addCallToQueue = async (input: UploadCallParams) => {
  // Send messagep
  await sqs
    .sendMessage({
      QueueUrl: env.SQS_QUEUE_URL,
      MessageBody: JSON.stringify(input),
    })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    });
};

export const uploadFromPresignedUrl = async (
  callId: string,
  recordingUrl: string,
) => {
  if (!recordingUrl) {
    throw new Error("Recording URL is required");
  }

  try {
    // Download the file from the URL
    const response = await fetch(recordingUrl);
    if (!response.ok) {
      throw new Error(`Failed to download file from URL: ${recordingUrl}`);
    }

    // Get content type from response headers
    const contentType =
      response.headers.get("content-type") || "application/octet-stream";

    // Determine file extension based on content type
    let extension = "bin";
    if (
      contentType.includes("audio/mpeg") ||
      contentType.includes("audio/mp3")
    ) {
      extension = "mp3";
    } else if (contentType.includes("audio/wav")) {
      extension = "wav";
    } else if (contentType.includes("audio/ogg")) {
      extension = "ogg";
    } else if (contentType.includes("audio/m4a")) {
      extension = "m4a";
    }

    const buffer = await response.arrayBuffer();

    const readableStream = new Readable({
      read() {
        this.push(Buffer.from(buffer));
        this.push(null);
      },
    });

    // Upload to S3
    const uploadParams = {
      Bucket: env.AWS_BUCKET_NAME,
      Key: `calls/${callId}-${Date.now()}.${extension}`,
      Body: Buffer.from(buffer),
      ContentType: contentType,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    return `https://${env.AWS_BUCKET_NAME}.s3.amazonaws.com/${uploadParams.Key}`;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
