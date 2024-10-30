import axios from "axios";
export async function extractThumbnail(pdfUrl: string) {
  try {
    const response = await axios.post<{ thumbnailUrl: string }>(
      `${process.env.SCRAPING_SERVICE_URL}/extract-thumbnail`,
      {
        pdfUrl,
      },
    );

    if (response.status !== 200) {
      return null;
    }

    console.log("THUMBNAIL URL", response.data.thumbnailUrl);
    return response.data.thumbnailUrl;
  } catch (error) {
    console.error(error);
    return null;
  }
}
