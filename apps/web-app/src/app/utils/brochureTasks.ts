import axios from "axios";
import { pdfToImage } from "~/lib/pdf-utils";
import { getBrochureFileName } from "~/lib/utils";
import { type PropertySchema } from "~/lib/property";

export const uploadImageTask = async (
  file: File,
  propertyId: string,
  getPresignedS3Url: (args: {
    fileName: string;
    fileType: string;
    keepOriginalName: boolean;
  }) => Promise<string>,
) => {
  const images = await pdfToImage({ file, pages: [1], height: 100 });
  const thumbnailBase64 = images[0]!;
  const base64Data = Buffer.from(
    thumbnailBase64.replace(/^data:image\/\w+;base64,/, ""),
    "base64",
  );
  const thumbnailPresignedUrl = await getPresignedS3Url({
    fileName: `brochure-thumbnail-${propertyId}.png`,
    fileType: "image/png",
    keepOriginalName: true,
  });
  await axios.put(thumbnailPresignedUrl, base64Data, {
    headers: {
      "Content-Type": "image/png",
    },
  });
  const thumbnailUrl =
    thumbnailPresignedUrl.split("?")[0] ?? thumbnailPresignedUrl;
  return thumbnailUrl;
};

export const uploadBrochureTask = async (
  file: File,
  property: PropertySchema,
  getPresignedS3Url: (args: {
    fileName: string;
    fileType: string;
    keepOriginalName: boolean;
  }) => Promise<string>,
) => {
  const brochurePresignedUrl = await getPresignedS3Url({
    fileName: getBrochureFileName(property),
    fileType: file.type,
    keepOriginalName: true,
  });
  await axios.put(brochurePresignedUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });

  const brochureUrl =
    brochurePresignedUrl.split("?")[0] ?? brochurePresignedUrl;
  return brochureUrl;
};
