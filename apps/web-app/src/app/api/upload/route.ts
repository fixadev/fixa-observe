import { NextResponse } from "next/server";
import { uploadFileToS3 } from "~/server/utils/s3utils";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const keepOriginalName = formData.get("keepOriginalName") === "true";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const result = await uploadFileToS3(file, keepOriginalName);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}
