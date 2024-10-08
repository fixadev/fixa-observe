import { NextResponse } from "next/server";
import { extractImagesFromPDF } from "~/app/utils/extractImages";
import { uploadFileToS3 } from "~/server/utils/s3utils";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const pdf = formData.get("file") as File | null;

    if (!pdf) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const s3urls = await extractImagesFromPDF(pdf);
    return NextResponse.json(s3urls);
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}
