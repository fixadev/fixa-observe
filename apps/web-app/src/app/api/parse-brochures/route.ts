import { NextResponse } from "next/server";
import { extractContactInfo } from "~/server/utils/extractContactInfo";
import { db } from "~/server/db";
import { uploadDropboxFileToS3 } from "~/app/utils/downloadDropboxFile";
import { brochureService } from "~/server/services/brochure";
import { type Prisma } from "@prisma/client";
import { sendSocketMessage } from "~/app/utils/sendSocketMessage";

const brochureServiceInstance = brochureService({ db });

export async function POST(request: Request) {
  const startTime = new Date();
  try {
    const { brochures, userId, surveyId } = (await request.json()) as {
      brochures: Array<{ id: string; url: string; propertyId: string }>;
      userId: string;
      surveyId: string;
    };

    if (!brochures) {
      return NextResponse.json({ error: "No brochures" }, { status: 400 });
    }

    const prismaTransactions: Prisma.PropertyUpdateArgs[] = [];

    const updatePromises = brochures.map(async (brochure) => {
      let brochureUrl = brochure.url;

      if (brochureUrl.includes("dropbox.com")) {
        const newUrl = await uploadDropboxFileToS3(brochure.url);
        await brochureServiceInstance.updateUrl(brochure.id, newUrl);
        brochureUrl = newUrl;
      }

      const contactInfo = await extractContactInfo(brochureUrl);
      if (contactInfo) {
        prismaTransactions.push({
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
      }
    });

    await Promise.all(updatePromises);

    await db.$transaction(
      prismaTransactions.map((tx) => db.property.update(tx)),
    );

    console.log(
      "======================done parsing brochures====================== in ",
      new Date().getTime() - startTime.getTime(),
      "ms",
    );

    await db.survey.update({
      where: {
        id: surveyId,
      },
      data: {
        importInProgress: false,
      },
    });

    await sendSocketMessage(userId, "done!");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error parsing brochures:", error);
    return NextResponse.json(
      { error: "Failed to parse brochures" },
      { status: 500 },
    );
  }
}
