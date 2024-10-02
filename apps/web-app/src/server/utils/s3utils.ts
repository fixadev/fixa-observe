import {
  ObjectCannedACL,
  PutObjectCommand,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { s3Client } from "~/server/config/s3client";

export const uploadFileToS3 = async (
  file: File,
): Promise<{ url: string; type: string }> => {
  const fileExtension = file.name.split(".").pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const arrayBuffer = Buffer.from(await file.arrayBuffer());
  const params: PutObjectCommandInput = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: arrayBuffer,
    ContentType: file.type,
    ACL: ObjectCannedACL.public_read,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return {
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`,
      type: file.type,
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file");
  }
};
