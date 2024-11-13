import { Bucket } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";

export function uploadFile(
  buffer: Buffer,
  bucket: Bucket,
  originalName: string,
): Promise<{ fileName: string }> {
  const fileName = `${uuidv4()}-${originalName.replace(/\s/g, "-")}`;
  const blob = bucket.file(fileName);

  return new Promise((resolve, reject) => {
    const blobStream = blob.createWriteStream();

    blobStream.on("error", (err: any) => {
      console.error("Error uploading file:", err);
      reject(err);
    });

    blobStream.on("finish", () =>
      resolve({
        fileName,
      }),
    );

    blobStream.end(buffer);
  });
}
