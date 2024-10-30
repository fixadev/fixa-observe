import axios from "axios";
import { env } from "~/env";
export async function extractThumbnail(pdfUrl: string) {
  try {
    const response = await axios.post<{ thumbnailUrl: string }>(
      `${env.SCRAPING_SERVICE_URL}/extract-thumbnail`,
      {
        pdfUrl,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.status !== 200) {
      console.log("Non-200 status code received, returning null");
      return null;
    }

    return response.data.thumbnailUrl;
  } catch (error) {
    console.error("Error extracting thumbnail:", error);
    return null;
  }
}
