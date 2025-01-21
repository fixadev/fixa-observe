import { env } from "../env";
import { sqs } from "../clients/s3Client";
import { s3 } from "../clients/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { UploadCallParams } from "@repo/types/src/types";
import { spawn } from "child_process";

export const addCallToQueue = async (input: UploadCallParams) => {
  // Send message
  await sqs
    .sendMessage({
      QueueUrl: env.SQS_QUEUE_URL,
      MessageBody: JSON.stringify(input),
    })
    .then((res) => {
      // console.log(res);
    })
    .catch((err) => {
      console.error(err);
    });
};

export const uploadFromPresignedUrl = async (
  callId: string,
  recordingUrl: string,
  flipped: boolean,
) => {
  if (!recordingUrl) {
    throw new Error("Recording URL is required");
  }

  try {
    // Download the file from the URL
    let url = recordingUrl;
    let username;
    let password;
    if (/^[^:]+:[^@]+@/.test(recordingUrl)) {
      const [protocol, rest] = recordingUrl.split("://");
      const [credentials, baseUrl] = rest.split("@");
      [username, password] = credentials.split(":");
      url = `${protocol}://${baseUrl}`;
    }

    const response = await fetch(url, {
      headers:
        username && password
          ? {
              Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`,
            }
          : undefined,
    });
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

    let finalBuffer = Buffer.from(buffer);

    if (flipped) {
      await new Promise((resolve, reject) => {
        const ffmpeg = spawn("ffmpeg", [
          "-i",
          "pipe:0", // Read from stdin
          "-af",
          "pan=stereo|c1=c0|c0=c1", // Swap channels
          "-f",
          "wav", // Output format
          "pipe:1", // Output to stdout
        ]);

        const chunks: Buffer[] = [];

        ffmpeg.stdout.on("data", (chunk) => chunks.push(chunk));
        ffmpeg.stderr.on("data", (data) =>
          console.error(`ffmpeg stderr: ${data}`),
        );

        ffmpeg.on("close", (code) => {
          if (code === 0) {
            finalBuffer = Buffer.concat(chunks);
            resolve(null);
          } else {
            reject(new Error(`ffmpeg process exited with code ${code}`));
          }
        });

        // Write input buffer to ffmpeg's stdin
        ffmpeg.stdin.write(Buffer.from(buffer));
        ffmpeg.stdin.end();
      });
    }

    // Upload to S3
    const uploadParams = {
      Bucket: env.AWS_BUCKET_NAME,
      Key: `calls/${callId}-${Date.now()}.${extension}`,
      Body: finalBuffer,
      ContentType: contentType,
    };

    await s3.send(new PutObjectCommand(uploadParams));

    return `https://${env.AWS_BUCKET_NAME}.s3.amazonaws.com/${uploadParams.Key}`;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
