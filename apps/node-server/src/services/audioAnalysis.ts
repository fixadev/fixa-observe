// import { VertexAI, type Part, SchemaType } from "@google-cloud/vertexai";
// import { Storage } from "@google-cloud/storage";
// import { uploadFile } from "./gcp";
// import { env } from "../env";
// import { z } from "zod";
// import { findLLMErrorsOutputSchema } from "./textAnalysis";
// import vapi from "../clients/vapiClient";
// import axios from "axios";

// const storage = new Storage({
//   credentials: JSON.parse(env.GCP_CREDENTIALS ?? "{}"),
// });
// const bucket = storage.bucket(env.GOOGLE_CLOUD_BUCKET_NAME ?? "");

// const evalResultSchema = {
//   type: SchemaType.OBJECT,
//   properties: {
//     evalId: {
//       type: SchemaType.STRING,
//       description: "Evaluation identifier",
//     },
//     result: {
//       type: SchemaType.STRING,
//       description: "Evaluation result",
//     },
//     success: {
//       type: SchemaType.BOOLEAN,
//       description: "Whether the evaluation was successful",
//     },
//     secondsFromStart: {
//       type: SchemaType.NUMBER,
//       description: "Seconds from start of call",
//     },
//     duration: {
//       type: SchemaType.NUMBER,
//       description: "Duration in seconds",
//     },
//     type: {
//       type: SchemaType.STRING,
//       description: "Evaluation type",
//       nullable: true,
//     },
//     details: {
//       type: SchemaType.STRING,
//       description: "Detailed evaluation information",
//     },
//   },
//   required: [
//     "evalId",
//     "result",
//     "success",
//     "secondsFromStart",
//     "duration",
//     "details",
//   ],
// };

// const geminiOutputSchema = {
//   type: SchemaType.OBJECT,
//   properties: {
//     scenarioEvalResults: {
//       type: SchemaType.ARRAY,
//       description: "Array of scenario evaluation results",
//       items: evalResultSchema,
//     },
//     generalEvalResults: {
//       type: SchemaType.ARRAY,
//       description: "Array of general evaluation results",
//       items: evalResultSchema,
//     },
//   },
//   required: ["scenarioEvalResults", "generalEvalResults"],
// };

// export async function analyzeCallWithGemini(
//   recordingUrl: string | undefined,
//   prompt: string,
// ) {
//   if (!recordingUrl) {
//     throw new Error("No recording URL found");
//   }

//   try {
//     const response = await fetch(recordingUrl);
//     const arrayBuffer = await response.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//     const { fileName } = await uploadFile(buffer, bucket, "recording.wav");
//     const result = await analyzeAudio(bucket.name, fileName, prompt);
//     return result;
//   } catch (error) {
//     console.error("Error in analyzeCallWithGemini:", error);
//     throw error;
//   }
// }

// export async function analyzeAudio(
//   bucket: string,
//   fileName: string,
//   prompt: string,
// ) {
//   try {
//     const fileUri = `gs://${bucket}/${fileName}`;
//     const fileUrl = `https://storage.cloud.google.com/${bucket}/${fileName}`;

//     const vertexai = new VertexAI({
//       project: "pixa-website",
//       googleAuthOptions: {
//         credentials: JSON.parse(env.GCP_CREDENTIALS ?? "{}"),
//       },
//     });
//     const model = vertexai.getGenerativeModel({
//       model: "gemini-1.5-pro-001",
//       generationConfig: {
//         responseMimeType: "application/json",
//         responseSchema: geminiOutputSchema,
//       },
//     });

//     const filePart: Part = {
//       fileData: {
//         fileUri: fileUri,
//         mimeType: "audio/wav",
//       },
//     };
//     const textPart: Part = {
//       text: prompt,
//     };

//     const request = {
//       contents: [{ role: "user", parts: [filePart, textPart] }],
//     };

//     const response = await model.generateContent(request);
//     const textResult =
//       response?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

//     return { textResult, fileUrl };
//   } catch (error) {
//     console.error("Error analyzing audio:", error);
//     throw error;
//   }
// }

// export const findTranscriptionErrors = async (callId: string) => {
//   try {
//     const call = await vapi.calls.get(callId);
//     const result = await axios.post(`${env.TRANSCRIPTION_SERVICE_URLL}/transcribe`, {
//       stereo_audio_url: call.artifact?.stereoRecordingUrl,
//     });
//     const originalTranscript = call.artifact?.transcript;
//     const { transcript: newTranscript } = result.data;
//   } catch (error) {
//     console.error("Error analyzing call:", error);
//     throw error;
//   }
// };
