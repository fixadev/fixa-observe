import { NextResponse } from "next/server";
import { extractContactInfo } from "~/server/utils/extractContactInfo";
import { db } from "~/server/db";

export async function POST(request: Request) {
  try {
    const { brochures } = (await request.json()) as {
      brochures: Array<{ url: string; propertyId: string }>;
    };

    if (!brochures) {
      return NextResponse.json({ error: "No brochures" }, { status: 400 });
    }

    const updatePromises = brochures.map(async (brochure) => {
      const contactInfo = await extractContactInfo(brochure.url);
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
