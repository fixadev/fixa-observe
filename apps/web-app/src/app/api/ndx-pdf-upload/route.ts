import { NextResponse } from "next/server";
import axios from "axios";
import { env } from "~/env";
import { type CreatePropertySchema } from "~/lib/property";
import { parsePropertyCard } from "~/server/utils/parsePropertyCard";
import { getServerCaller } from "~/trpc/backend";


export async function POST(request: Request) {
  
  const caller = await getServerCaller(request.headers);

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const surveyId = formData.get("surveyId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const serverFormData = new FormData();
    serverFormData.append("file", file, file.name);

    const response = await axios.post(
      `${env.SCRAPING_SERVICE_URL}/extract-ndx-pdf`,
      serverFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    const properties = response.data as Array<{image_url: string, text: string, link: string | undefined}>;

    const parsedProperties = properties.map((property) => { 
      const parsedProperty = parsePropertyCard(property.text);
      return {
        ...parsedProperty,
        brochureLink: property.link ?? undefined,
        photoUrl: property.image_url,
      };
    });

    const propertiesWithAttributes: Array<CreatePropertySchema> =
        parsedProperties.map((property, index) => {
          return {
            createdAt: new Date(),
            updatedAt: new Date(),
            photoUrl: property.photoUrl,
            brochures: property.brochureLink
              ? [
                  {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    url: property.brochureLink,
                    title: "",
                    approved: false,
                    inpaintedRectangles: [],
                  },
                ]
              : [],
            displayIndex: index,
            surveyId: surveyId,
            attributes: {
              address: property.address ?? "",
              size: property.size ?? "",
              divisibility:
                `${property.minDivisible} - ${property.maxDivisible}` ?? "",
              askingRate: property.leaseRate ?? "",
              opEx: property.opEx ?? "",
              directSublease: property.leaseType ?? "",
              comments: property.comments ?? "",
            },
          };
        });

    await caller.survey.updateProperties({
      surveyId,
      properties: propertiesWithAttributes,
      action: "add",
    });

    return NextResponse.json({ status: 200 });

  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}
