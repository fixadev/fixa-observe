import {
  ObjectCannedACL,
  PutObjectCommand,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "~/server/config/s3client";
// import fs from "fs/promises";
// import path from "path";

export const uploadFileToS3 = async (
  file: File,
  keepOriginalName = false,
): Promise<{ url: string; type: string }> => {
  const fileExtension = file.name.split(".").pop();
  const fileName = keepOriginalName
    ? file.name
    : `${uuidv4()}.${fileExtension}`;
  const arrayBuffer = Buffer.from(await file.arrayBuffer());
  const params: PutObjectCommandInput = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName + "-" + uuidv4(),
    Body: arrayBuffer,
    ContentType: file.type,
    ACL: ObjectCannedACL.public_read,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return {
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.us-east-1.amazonaws.com/${fileName}`,
      type: file.type,
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file");
  }
};

export const createPresignedUrl = async (
  fileName: string,
  fileType: string,
  expiresIn = 3600,
): Promise<string> => {
  const fileExtension = fileName.split(".").pop();
  const uniqueFileName = `${uuidv4()}.${fileExtension}`;

  const prefix = fileType === "application/pdf" ? "brochures" : "images";

  const params: PutObjectCommandInput = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${prefix}/${uniqueFileName}`,
    ContentType: fileType,
    ACL: ObjectCannedACL.public_read,
  };

  try {
    const command = new PutObjectCommand(params);
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return presignedUrl;
  } catch (error) {
    console.error("Error creating presigned URL:", error);
    throw new Error("Failed to create presigned URL");
  }
};

// const filepath = "/Users/oliverwendell-braly/pixa/real-estate-platform/apps/web-app/src/server/utils/366cambridge.pdf"

// async function test() {
//   const arrayBuffer = await fs.readFile(filepath);
//   // Get the file name from the path
//   const fileName = path.basename(filepath);
//   // Create a File object
//   const file = new File([arrayBuffer], fileName, { type: 'application/pdf' });
//   const text = await uploadFileToS3(file);
//   console.log('typeof text', typeof text);
//   console.log(text);
// }

// void test();
