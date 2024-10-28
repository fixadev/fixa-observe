import { createPresignedUrl } from "~/server/utils/s3utils";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("fileName");
    const fileType = searchParams.get("fileType");
    const keepOriginalName = searchParams.get("keepOriginalName") === "true";
    const expiresIn = searchParams.get("expiresIn")
      ? parseInt(searchParams.get("expiresIn")!)
      : 3600;

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: "fileName and fileType are required" },
        { status: 400 },
      );
    }

    const presignedUrl = await createPresignedUrl(
      fileName,
      fileType,
      keepOriginalName,
      expiresIn,
    );

    return NextResponse.json({ url: presignedUrl });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 },
    );
  }
}
