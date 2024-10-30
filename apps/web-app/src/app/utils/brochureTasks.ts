import axios from "axios";
import { getBrochureFileName } from "~/lib/utils";
import { type PropertySchema } from "~/lib/property";

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
