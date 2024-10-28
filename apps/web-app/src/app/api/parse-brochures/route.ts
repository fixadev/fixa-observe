import { NextResponse } from "next/server";
import { extractContactInfo } from "~/server/utils/extractContactInfo";
import { db } from "~/server/db";
import { uploadDropboxFileToS3 } from "~/app/utils/downloadDropboxFile";
import { brochureService } from "~/server/services/brochure";

const brochureServiceInstance = brochureService({ db });

export async function POST(request: Request) {
  try {
    const { brochures } = (await request.json()) as {
      brochures: Array<{ id: string; url: string; propertyId: string }>;
    };

    if (!brochures) {
      return NextResponse.json({ error: "No brochures" }, { status: 400 });
    }

    const updatePromises = brochures.map(async (brochure) => {
      let brochureUrl = brochure.url;

      if (brochureUrl.includes("dropbox.com")) {
        console.log("Uploading dropbox file to S3!");
        const newUrl = await uploadDropboxFileToS3(brochure.url);
        await brochureServiceInstance.updateUrl(brochure.id, newUrl);
        console.log("newUrl", newUrl);
        brochureUrl = newUrl;
      }

      console.log("extracting contact info from", brochureUrl);
      const contactInfo = await extractContactInfo(brochureUrl);
      if (contactInfo) {
        const result = await db.property.update({
          where: {
            id: brochure.propertyId,
          },
          data: {
            contacts: {
              createMany: {
                data: contactInfo,
              },
            },
          },
        });
        return result;
      }
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}
