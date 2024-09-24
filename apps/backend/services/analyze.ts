import { VertexAI, type Part } from "@google-cloud/vertexai";
import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";
import db from "./db";
import { type Conversation } from "@prisma/client";
import { getProject } from "@repo/project-domain/services/project";

const storage = new Storage();
const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME ?? "");

export async function analyzeConversation(file: Express.Multer.File, transcript: string, projectId: string) {
  try {
    const { fileName } = await uploadFile(file);
    const result = await analyzeAudio(projectId, bucket.name, fileName, transcript);
    console.log("Audio analysis result:", result);
    return result;
  } catch (error) {
    console.error("Error in analyzeConversation:", error);
    throw error; 
  }
}

function uploadFile(file: Express.Multer.File): Promise<{fileName: string}> {
  const fileName = `${uuidv4()}-${file.originalname.replace(/\s/g, "-")}`;
  const blob = bucket.file(fileName);
  const buffer = file.buffer;

  return new Promise((resolve, reject) => {
    const blobStream = blob.createWriteStream();

    blobStream.on("error", (err: any) => {
      console.error("Error uploading file:", err);
      reject(err);
    });

    blobStream.on("finish", () => resolve(
      {
        fileName
      }
    ));

    blobStream.end(buffer);
  });
}

export async function analyzeAudio(
    projectId: string,
    bucket: string,
    fileName: string,
    transcript: string,
  ) {
    try {
      const fileUri = `gs://${bucket}/${fileName}`;
      const fileUrl = `https://storage.cloud.google.com/${bucket}/${fileName}`;
  
      const vertexai = new VertexAI({
        project: "pixa-website",
      });
      const model = vertexai.getGenerativeModel({
        model: "gemini-1.5-pro-001",
      });
  
      const project = await getProject(projectId, db);
  
      if (!project) {
        throw new Error("Project not found");
      }
  
      const possibleOutcomes = project.possibleOutcomes;
  
  
      const prompt = `
          Analyze this recording of a phone call.
  
          There are ${possibleOutcomes.length} possible outcomes for a call
          ${possibleOutcomes.map((outcome, index) => `${index}. ${outcome.name}`).join("\n")}
  
          Return a json with three properties.
  
          desiredOutcome: (0-${possibleOutcomes.length - 1})
          actualOutcome: (0-${possibleOutcomes.length - 1})
          probSuccess: Certainty that the actual outcome matched the desired outcome (0-100%) 
          analysis: A summary of the conversation, including the desired outcome, actual outcome, and the cause of the outcome.
      `;
   
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
  
      if (cleanedResult) {
        console.log(cleanedResult);
        const { desiredOutcome, actualOutcome, probSuccess, analysis } = JSON.parse(
          cleanedResult,
        ) as {
          desiredOutcome: number;
          actualOutcome: number;
          probSuccess: number;
          analysis: string;
        };
        if (
          desiredOutcome !== undefined &&
          actualOutcome !== undefined &&
          probSuccess !== undefined &&
          analysis !== undefined
        ) {
  
          const desiredOutcomeId = possibleOutcomes[desiredOutcome]?.id;
          const actualOutcomeId = possibleOutcomes[actualOutcome]?.id;
  
          if (!desiredOutcomeId || !actualOutcomeId) {
            throw new Error("Outcome not found");
          }
  
          await insertConversation({
            id: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date(),
            projectId,
            transcript,
            audioUrl: fileUrl,
            analysis: analysis,
            desiredOutcomeId: desiredOutcomeId,
            actualOutcomeId: actualOutcomeId,
            probSuccess: probSuccess,
          });
        } else {
          console.log("error parsing LLM result", cleanedResult);
        }
        return result;
      } else {
        throw new Error("No result");
      }
    } catch (error) {
      console.error("Error analyzing audio:", error);
      throw error;
    }
  }
  
  // TODO: move these to a service
  export async function insertConversation(conversation: Conversation) {
    try {
      const result = await db.conversation.create({
        data: {
          projectId: conversation.projectId,
          transcript: conversation.transcript,
          audioUrl: conversation.audioUrl,
          analysis: conversation.analysis,
          desiredOutcomeId: conversation.desiredOutcomeId,
          actualOutcomeId: conversation.actualOutcomeId,
          probSuccess: conversation.probSuccess,
        },
      });
      console.log("Conversation created:", result);
      return result;
    } catch (error) {
      console.error("Error inserting conversation:", error);
      throw error;
    }
  };