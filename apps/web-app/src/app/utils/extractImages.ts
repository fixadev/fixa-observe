import {
  ServicePrincipalCredentials,
  PDFServices,
  MimeType,
  ExtractRenditionsElementType,
  ExtractPDFParams,
  ExtractElementType,
  ExtractPDFJob,
  ExtractPDFResult,
  SDKError,
  ServiceUsageError,
  ServiceApiError,
} from "@adobe/pdfservices-node-sdk";
import { Readable } from "stream";
import JSZip from "jszip";
import { uploadFileToS3 } from "~/server/utils/s3utils";
import { env } from "~/env";

export async function extractImagesFromPDF(pdf: File) {
  let readStream: Readable | undefined;
  const s3objects = [];
  try {
    const credentials = new ServicePrincipalCredentials({
      clientId: env.ADOBE_CLIENT_ID,
      clientSecret: env.ADOBE_CLIENT_SECRET,
    });

    const pdfServices = new PDFServices({ credentials });
    const arrayBuffer = await pdf.arrayBuffer();
    readStream = new Readable({
      read() {
        this.push(Buffer.from(arrayBuffer));
        this.push(null);
      },
    });

    const inputAsset = await pdfServices.upload({
      readStream: readStream,
      mimeType: MimeType.PDF,
    });

    const params = new ExtractPDFParams({
      elementsToExtract: [ExtractElementType.TEXT],
      elementsToExtractRenditions: [ExtractRenditionsElementType.FIGURES],
    });

    const job = new ExtractPDFJob({ inputAsset, params });
    const pollingURL = await pdfServices.submit({ job });
    const pdfServicesResponse = await pdfServices.getJobResult({
      pollingURL,
      resultType: ExtractPDFResult,
    });

    const resultAsset = pdfServicesResponse?.result?.resource;
    const streamAsset = await pdfServices.getContent({ asset: resultAsset! });

    try {
      const zipContent = await handleZipStream(streamAsset);

      console.log("Files in the zip:", Object.keys(zipContent.files));

      // Filter for PNG files in the figures folder
      const figureFiles = Object.keys(zipContent.files).filter(
        (filename) =>
          filename.startsWith("figures/") &&
          filename.toLowerCase().endsWith(".png"),
      );

      console.log("Figure files found:", figureFiles);

      // Extract and upload each figure
      for (const filename of figureFiles) {
        try {
          const blobContent = await zipContent.file(filename)?.async("blob");
          if (blobContent) {
            // Convert blob to File
            const fileContent = new File([blobContent], filename, {
              type: blobContent.type,
            });
            const uploadResult = await uploadFileToS3(fileContent);
            console.log(`Uploaded ${filename} to S3`);
            console.log("Upload result:", uploadResult);
            const index = filename.match(/\d+/)?.[0] ?? "0";
            s3objects.push({ ...uploadResult, index });
          } else {
            console.warn(`File ${filename} not found in zip or is empty`);
          }
        } catch (error) {
          console.error(`Error processing file ${filename}:`, error);
        }
      }
    } catch (error) {
      console.error("Error processing zip stream:", error);
    }

    return s3objects
      .sort((a, b) => parseInt(a.index) - parseInt(b.index))
      .map((obj) => obj.url);
  } catch (err) {
    if (
      err instanceof SDKError ||
      err instanceof ServiceUsageError ||
      err instanceof ServiceApiError
    ) {
      console.log("Exception encountered while executing operation", err);
    } else {
      console.log("Exception encountered while executing operation", err);
    }
  } finally {
    readStream?.destroy();
  }
}

async function handleZipStream(streamAsset: { readStream: Readable }) {
  return new Promise<JSZip>((resolve, reject) => {
    const chunks: Buffer[] = [];

    streamAsset.readStream.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    streamAsset.readStream.on("end", () => {
      const fullBuffer = Buffer.concat(chunks);
      void (async () => {
        try {
          const zip = new JSZip();
          const loadedZip = await zip.loadAsync(fullBuffer);
          resolve(loadedZip);
        } catch (error) {
          reject(error);
        }
      })();
    });

    streamAsset.readStream.on("error", (error) => {
      reject(error);
    });
  });
}

// async function test() {
//   const filePath = "/Users/oliverwendell-braly/pixa/real-estate-platform/apps/web-app/src/app/utils/ndx.pdf";
//   const fileBuffer = fs.readFileSync(filePath);
//   const file = new File([fileBuffer], "ndx.pdf", { type: 'application/pdf' });
//   await extractImagesFromPDF(file);
// }

// void test();
