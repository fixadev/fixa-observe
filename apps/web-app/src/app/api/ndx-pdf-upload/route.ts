import { NextResponse } from "next/server";
import axios from "axios";
import { env } from "~/env";
import { api } from "~/trpc/server";
import fs from "fs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    console.log("file received");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const serverFormData = new FormData();
    serverFormData.append("file", file, file.name);

    console.log("making request to scraping service");

    const response = await axios.post(
      `${env.SCRAPING_SERVICE_URL}/extract-ndx-pdf`,
      serverFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    console.log("response from scraping service");
    console.log(response.data);

    return NextResponse.json({ hello: "world" });

    // const s3urls = await extractImagesFromPDF(pdf);

    // return NextResponse.json(s3urls);
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}
