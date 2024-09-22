import { type NextRequest, NextResponse } from "next/server";
import { VertexAI, type Part } from "@google-cloud/vertexai";
import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";
import { db } from "~/server/db";
import { type Conversation } from "@prisma/client";
import { getProject } from "~/app/shared/services/getProject";

// const storage = new Storage({
//   projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
//   credentials: {
//     client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL ?? '',
//     private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY ?? '',
//   },
// });

const storage = new Storage();

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME ?? "");

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const transcript = formData.get("transcript") as string;
    const projectId = formData.get("projectId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!projectId) {
      return NextResponse.json(
        { error: "No projectId uploaded" },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("audio/")) {
      return NextResponse.json(
        { error: "File must be an audio file" },
        { status: 400 },
      );
    }

    const buffer = await file.arrayBuffer();
    const fileName = `${uuidv4()}-${file.name.replace(/\s/g, "-")}`;

    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream();

    return new Promise((resolve, reject) => {
      blobStream.on("error", (err) => {
        console.error("Error uploading file:", err);
        reject(
          NextResponse.json({ error: "Error uploading file" }, { status: 500 }),
        );
      });

      blobStream.on("finish", () => {
        void (async () => {
          try {
            const result = await analyzeAudio(
              projectId,
              bucket.name,
              fileName,
              transcript,
            );
            resolve(NextResponse.json({ result }, { status: 200 }));
          } catch (error) {
            console.error("Error analyzing audio:", error);
            resolve(
              NextResponse.json(
                { error: "Audio analysis failed" },
                { status: 500 },
              ),
            );
          }
        })();
      });

      blobStream.end(Buffer.from(buffer));
    });
  } catch (error) {
    console.error("Error in file upload:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

async function analyzeAudio(
  projectId: string,
  bucket: string,
  fileName: string,
  transcript: string,
) {
  try {
    const fileUri = `gs://${bucket}/${fileName}`;
    const fileUrl = `https://storage.googleapis.com/${bucket}/${fileName}`;

    const vertexai = new VertexAI({
      project: "pixa-website",
    });
    const model = vertexai.getGenerativeModel({
      model: "gemini-1.5-pro-001",
    });

    const project = await getProject(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    const possibleOutcomes = project.possibleOutcomes;

    const prompt = `
        Analyze this recording of a phone call.

        There are ${possibleOutcomes.length} possible outcomes for a call
        ${possibleOutcomes.map((outcome, index) => `${index + 1}. ${outcome.name}`).join("\n")}

        Return a json with three properties.

        desiredOutcome (1-${possibleOutcomes.length})
        actualOutcome (1-${possibleOutcomes.length})
        probSuccess: Certainty that the actual outcome matched the desired outcome (0-100%) 
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
      ?.replaceAll("```json\n", "")
      .replaceAll("\n```", "")
      .trim();

    if (cleanedResult) {
      console.log(cleanedResult);
      const { desiredOutcome, actualOutcome, probSuccess } = JSON.parse(
        cleanedResult,
      ) as {
        desiredOutcome: string;
        actualOutcome: string;
        probSuccess: string;
      };
      if (
        desiredOutcome !== undefined &&
        actualOutcome !== undefined &&
        probSuccess !== undefined
      ) {
        await insertConversation({
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
          projectId,
          transcript,
          audioUrl: fileUrl,
          analysis: cleanedResult,
          desiredOutcome: Number(desiredOutcome),
          actualOutcome: Number(actualOutcome),
          probSuccess: Number(probSuccess),
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
const insertConversation = async (conversation: Conversation) => {
  try {
    const result = await db.conversation.create({
      data: {
        projectId: conversation.projectId,
        transcript: conversation.transcript,
        audioUrl: conversation.audioUrl,
        analysis: conversation.analysis,
        desiredOutcome: conversation.desiredOutcome,
        actualOutcome: conversation.actualOutcome,
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

const createMockProject = async () => {
  try {
    const result = await db.project.create({
      data: {
        ownerId: "mock-user-id",
        name: "Mock Project",
        possibleOutcomes: {
          create: [
            {
              name: "Positive Outcome",
              description: "The project succeeds beyond expectations",
            },
            {
              name: "Neutral Outcome",
              description: "The project meets basic requirements",
            },
            {
              name: "Negative Outcome",
              description: "The project fails to meet its objectives",
            },
          ],
        },
      },
      include: {
        possibleOutcomes: true,
      },
    });
    console.log("Mock project created:", result);
    return result;
  } catch (error) {
    console.error("Error creating mock project:", error);
    throw error;
  }
};
