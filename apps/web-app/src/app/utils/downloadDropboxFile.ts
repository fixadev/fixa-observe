import axios, { type AxiosResponse } from "axios";
import { createPresignedUrl } from "~/server/utils/s3utils";

export async function uploadDropboxFileToS3(url: string) {
  if (url.endsWith("dl=0")) {
    url = url.replace("dl=0", "dl=1");
  }
  const response: AxiosResponse<ArrayBuffer> = await axios.get(url, {
    responseType: "arraybuffer",
  });

  const urlParts = url.split("/");
  const lastPart = urlParts[urlParts.length - 1];
  const fileName = lastPart?.split("?")[0] ?? "document.pdf";

  // const localPath = path.join(process.cwd(), "temp", fileName);
  // await fs.mkdir(path.dirname(localPath), { recursive: true });
  // await fs.writeFile(localPath, Buffer.from(response.data));
  // console.log(`File saved locally at: ${localPath}`);

  const file = new File([response.data], fileName, {
    type: "application/pdf",
  });

  const presignedS3Url = await createPresignedUrl(fileName, "application/pdf");
  const uploadResponse = await fetch(presignedS3Url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": "application/pdf",
    },
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload file to S3");
  }

  const uploadedFileUrl = presignedS3Url.split("?")[0] ?? presignedS3Url;
  return uploadedFileUrl;
}

// async function test() {
//   const url =
//     "https://www.dropbox.com/scl/fi/7ts3ocexhk9myz4mq5jd5/1-Almaden.pdf?rlkey=c5ld3fhmobmsyl21rv1l4cfii&e=1&st=axerwh34&dl=0";
//   const newUrl = await uploadDropboxFileToS3(url);
//   console.log("newUrl", newUrl);
// }

// void test();
