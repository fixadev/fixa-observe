import { VertexAI, type Part, SchemaType } from "@google-cloud/vertexai";
import { Storage } from "@google-cloud/storage";
import { uploadFile } from "../helpers/gcpUpload";
import { env } from "../env";
import { z } from "zod";
import { outputSchema } from "./findLLMErrors";
const storage = new Storage({
  credentials: JSON.parse(env.GCP_CREDENTIALS ?? "{}"),
});
const bucket = storage.bucket(env.GOOGLE_CLOUD_BUCKET_NAME ?? "");

const evalResultSchema = {
  type: SchemaType.OBJECT,
  properties: {
    id: {
      type: SchemaType.STRING,
      description: "CUID identifier",
    },
    createdAt: {
      type: SchemaType.STRING,
      description: "Creation date",
    },
    callId: {
      type: SchemaType.STRING,
      description: "Call identifier",
      nullable: true,
    },
    evalId: {
      type: SchemaType.STRING,
      description: "Evaluation identifier",
    },
    result: {
      type: SchemaType.STRING,
      description: "Evaluation result",
    },
    success: {
      type: SchemaType.BOOLEAN,
      description: "Whether the evaluation was successful",
    },
    secondsFromStart: {
      type: SchemaType.NUMBER,
      description: "Seconds from start of call",
    },
    duration: {
      type: SchemaType.NUMBER,
      description: "Duration in seconds",
    },
    type: {
      type: SchemaType.STRING,
      description: "Evaluation type",
      nullable: true,
    },
    details: {
      type: SchemaType.STRING,
      description: "Detailed evaluation information",
    },
  },
  required: [
    "id",
    "createdAt",
    "evalId",
    "result",
    "success",
    "secondsFromStart",
    "duration",
    "details",
  ],
};

const geminiOutputSchema = {
  type: SchemaType.OBJECT,
  properties: {
    scenarioEvalResults: {
      type: SchemaType.ARRAY,
      description: "Array of scenario evaluation results",
      items: evalResultSchema,
    },
    generalEvalResults: {
      type: SchemaType.ARRAY,
      description: "Array of general evaluation results",
      items: evalResultSchema,
    },
  },
  required: ["scenarioEvalResults", "generalEvalResults"],
};

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
        credentials: JSON.parse(env.GCP_CREDENTIALS ?? "{}"),
      },
    });
    const model = vertexai.getGenerativeModel({
      model: "gemini-1.5-pro-latest",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: geminiOutputSchema,
      },
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

    const parsedResult: z.infer<typeof outputSchema> = JSON.parse(result ?? "");

    return { parsedResult, fileUrl };
  } catch (error) {
    console.error("Error analyzing audio:", error);
    throw error;
  }
}

console.log(env.GCP_CREDENTIALS);
