import { NextResponse } from "next/server";
import { extractContactInfo } from "~/server/utils/extractContactInfo";
import { db } from "~/server/db";
import { uploadDropboxFileToS3 } from "~/app/utils/downloadDropboxFile";
import { brochureService } from "~/server/services/brochure";
import { type Prisma } from "@prisma/client";
import { sendSocketMessage } from "~/app/utils/sendSocketMessage";
import { extractThumbnail } from "~/server/utils/extractThumbnail";

const brochureServiceInstance = brochureService({ db });

export async function POST(request: Request) {
  const startTime = new Date();
  const { brochures, userId, surveyId } = (await request.json()) as {
    brochures: Array<{ id: string; url: string; propertyId: string }>;
    userId: string;
    surveyId: string;
  };

  try {
    if (!brochures) {
      return NextResponse.json({ error: "No brochures" }, { status: 400 });
    }

    const prismaTransactions: Prisma.PrismaPromise<unknown>[] = [];

    const extractContactPromises = brochures.map(async (brochure) => {
      let brochureUrl = brochure.url;

      const brochureThumbnailUrl = await extractThumbnail(brochureUrl);

      if (brochureUrl.includes("dropbox.com")) {
        const newUrl = await uploadDropboxFileToS3(brochureUrl);
        prismaTransactions.push(
          db.brochure.update({
            where: { id: brochure.id },
            data: { url: newUrl, thumbnailUrl: brochureThumbnailUrl },
          }),
        );
        brochureUrl = newUrl;
      } else {
        prismaTransactions.push(
          db.brochure.update({
            where: { id: brochure.id },
            data: { thumbnailUrl: brochureThumbnailUrl },
          }),
        );
      }

      const contactInfo = await extractContactInfo(brochureUrl);
      if (contactInfo) {
        prismaTransactions.push(
          db.property.update({
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
          }),
        );
      }
    });

    await Promise.allSettled(extractContactPromises);

    await db.$transaction(prismaTransactions);

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
    await db.survey.update({
      where: { id: surveyId },
      data: { importInProgress: false },
    });
    await sendSocketMessage(userId, "done!");
    return NextResponse.json(
      { error: "Failed to parse brochures" },
      { status: 500 },
    );
  }
}
