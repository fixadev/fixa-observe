import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';
import { VertexAI, type Part } from '@google-cloud/vertexai';
import { v4 as uuidv4 } from 'uuid';

// const storage = new Storage({
//   projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
//   credentials: {
//     client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL ?? '',
//     private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY ?? '',
//   },
// });

const storage = new Storage();

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME ?? '');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!file.type.startsWith('audio/')) {
      return NextResponse.json({ error: 'File must be an audio file' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const fileName = `${uuidv4()}-${file.name.replace(/\s/g, '-')}`;

    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream();

    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => {
        reject(NextResponse.json({ error: 'Error uploading file' }, { status: 500 }));
      });

      blobStream.on('finish', () => {
        void (async () => {
          try {
            const fileUri = `gs://${bucket.name}/${fileName}`
            const result = await analyzeAudio(fileUri);
            resolve(NextResponse.json({ fileUri, result }, { status: 200 }));
          } catch (error) {
            console.error('Error analyzing audio:', error);
            resolve(NextResponse.json({ error: 'Audio analysis failed' }, { status: 500 }));
          }
        })();
      });

      blobStream.end(Buffer.from(buffer));
    });

  } catch (error) {
    console.error('Error in file upload:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


async function analyzeAudio(publicUrl: string) {
  const vertexai = new VertexAI({
    project: 'pixa-website',
  });
  const model = vertexai.getGenerativeModel({
    model: 'gemini-1.5-pro-001',
  });

  const prompt = `
      Analyze this recording of a phone call.

      There are 4 possible outcomes for a call
      An appointment is scheduled
      An appointment is canceled
      An appointment is rescheduled
      Nothing happens 

      Return a json with two properties.

      desired outcome (1-4)
      actual outcome (1-4)
      prob_success: Certainty that the actual outcome matched the desired outcome (0-100%) 
  `

  const filePart: Part = {
    fileData: {
      fileUri: publicUrl,
      mimeType: 'audio/wav',
    }
  }
  const textPart: Part = {
    text: prompt,
  }

  const request = {
    contents: [{role: 'user', parts: [filePart, textPart]}],
  }

  const response = await model.generateContent(request);
  const result = response.response
  console.log(result)
  return result
}

