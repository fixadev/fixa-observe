import { NextResponse } from "next/server";
import { extractContactInfo } from "~/server/utils/extractContactInfo";
import { propertyService } from "~/server/services/property";
import { db } from "~/server/db";
import { uploadDropboxFileToS3 } from "~/app/utils/downloadDropboxFile";

const propertyServiceInstance = propertyService({ db });

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
        await propertyServiceInstance.updateBrochureUrl(
          brochure.id,
          newUrl,
          brochure.propertyId,
        );
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
