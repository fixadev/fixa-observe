import s3 from "../utils/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "../env";

export const uploadFromPresignedUrl = async (url: string, callId: string) => {
  // Download the file from the URL
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download file from URL: ${url}`);
  }
  // Get content type from response headers
  const contentType =
    response.headers.get("content-type") || "application/octet-stream";

  // Determine file extension based on content type
  let extension = "bin";
  if (contentType.includes("audio/mpeg") || contentType.includes("audio/mp3")) {
    extension = "mp3";
  } else if (contentType.includes("audio/wav")) {
    extension = "wav";
  } else if (contentType.includes("audio/ogg")) {
    extension = "ogg";
  } else if (contentType.includes("audio/m4a")) {
    extension = "m4a";
  }

  const buffer = await response.arrayBuffer();

  // Upload to S3
  const uploadParams = {
    Bucket: env.AWS_BUCKET_NAME,
    Key: `calls/${callId}/audio.${extension}`,
    Body: Buffer.from(buffer),
    ContentType: contentType,
  };

  await s3.send(new PutObjectCommand(uploadParams));

  return {
    url: `https://${env.AWS_BUCKET_NAME}.s3.amazonaws.com/${uploadParams.Key}`,
  };
};
