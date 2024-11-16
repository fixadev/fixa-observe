import { VertexAI, type Part } from "@google-cloud/vertexai";
import { Storage } from "@google-cloud/storage";
import { uploadFile } from "../helpers/gcpUpload";

const storage = new Storage({
  credentials: JSON.parse(process.env.GCP_CREDENTIALS ?? "{}"),
});
const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME ?? "");

export async function analyzeCallWithGemini(
  recordingUrl: string | undefined,
  prompt: string,
) {
  if (!recordingUrl) {
    throw new Error("No recording URL found");
  }

  try {
    const response = await fetch(recordingUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const { fileName } = await uploadFile(buffer, bucket, "recording.wav");
    const result = await analyzeAudio(bucket.name, fileName, prompt);
    return result;
  } catch (error) {
    console.error("Error in analyzeCallWithGemini:", error);
    throw error;
  }
}

export async function analyzeAudio(
  bucket: string,
  fileName: string,
  prompt: string,
) {
  try {
    const fileUri = `gs://${bucket}/${fileName}`;
    const fileUrl = `https://storage.cloud.google.com/${bucket}/${fileName}`;

    const vertexai = new VertexAI({
      project: "pixa-website",
      googleAuthOptions: {
        credentials: JSON.parse(process.env.GCP_CREDENTIALS ?? "{}"),
      },
    });
    const model = vertexai.getGenerativeModel({
      model: "gemini-1.5-pro-001",
    });

    const filePart: Part = {
      fileData: {
        fileUri: fileUri,
        mimeType: "audio/wav",
      },
    };
    const textPart: Part = {
      text: prompt,
    };

    const request = {
      contents: [{ role: "user", parts: [filePart, textPart] }],
    };

    const response = await model.generateContent(request);
    const result =
      response?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    const cleanedResult = result
      ?.replace("```json\n", "")
      .replace("\n```", "")
      .trim();

    return { cleanedResult, fileUrl };
  } catch (error) {
    console.error("Error analyzing audio:", error);
    throw error;
  }
}
