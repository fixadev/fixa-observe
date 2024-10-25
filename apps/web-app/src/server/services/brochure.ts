import { type Prisma, type PrismaClient } from "@prisma/client";
import {
  brochureRectangles,
  type BrochureWithoutPropertyId,
  type BrochureRectangles,
  type Path,
  type RemoveRectanglesInput,
  type TransformedTextContent,
  type BrochureSchema,
} from "~/lib/brochure";
import axios from "axios";
import { env } from "~/env";
import { extractContactInfo } from "../utils/extractContactInfo";

export const brochureService = ({ db }: { db: PrismaClient }) => {
  async function extractAndUploadContactInfo(
    brochureUrl: string,
    propertyId: string,
    userId: string,
  ) {
    const contactInfo = await extractContactInfo(brochureUrl);
    return await db.property.update({
      where: {
        id: propertyId,
        ownerId: userId,
      },
      data: {
        contacts: {
          createMany: {
            data: contactInfo ?? [],
          },
        },
      },
    });
  }
  return {
    create: async (
      propertyId: string,
      brochure: BrochureWithoutPropertyId,
      userId: string,
    ) => {
      // TODO: determine if this actually works
      void extractAndUploadContactInfo(brochure.url, propertyId, userId);
      const response = await db.property.update({
        where: {
          id: propertyId,
          ownerId: userId,
        },
        data: {
          brochures: {
            deleteMany: {},
            create: [
              {
                ...brochure,
                approved: false,
                inpaintedRectangles: [],
                textToRemove: [],
                pathsToRemove: [],
              },
            ],
          },
        },
      });
      return response;
    },

    createMany: async (brochures: Prisma.BrochureCreateManyInput[]) => {
      return await db.brochure.createMany({
        data: brochures,
      });
    },

    get: async (brochureId: string, userId: string) => {
      const brochure = await db.brochure.findUnique({
        where: {
          id: brochureId,
          property: {
            ownerId: userId,
          },
        },
      });
      return brochure;
    },

    update: async (brochure: BrochureSchema, userId: string) => {
      const response = await db.brochure.update({
        where: {
          id: brochure.id,
          property: {
            ownerId: userId,
          },
        },
        data: {
          ...brochure,
          inpaintedRectangles: brochure.inpaintedRectangles ?? [],
          textToRemove: brochure.textToRemove ?? [],
          pathsToRemove: brochure.pathsToRemove ?? [],
        },
      });
      return response;
    },

    updateUrl: async (brochureId: string, url: string, userId: string) => {
      return db.brochure.update({
        where: {
          id: brochureId,
        },
        data: {
          url,
        },
      });
    },

    delete: async (propertyId: string, brochureId: string, userId: string) => {
      const property = await db.property.findUnique({
        where: {
          id: propertyId,
          ownerId: userId,
        },
      });

      if (!property) {
        throw new Error("Property not found");
      }

      return db.property.update({
        where: {
          id: propertyId,
          ownerId: userId,
        },
        data: {
          brochures: {
            delete: {
              id: brochureId,
            },
          },
        },
      });
    },

    inpaintRectangles: async (input: RemoveRectanglesInput) => {
      try {
        const data = await db.brochure.findUnique({
          where: {
            id: input.brochureId,
          },
        });
        const response = await axios.post<{
          newRectangles: BrochureRectangles;
        }>(`${env.INPAINTING_SERVICE_URL}/inpaint`, {
          brochureUrl: data?.url,
          rectanglesToRemove: input.rectanglesToRemove,
        });

        const oldRectangles =
          brochureRectangles.safeParse(data?.inpaintedRectangles).data ?? [];

        if (response.status === 200 && response.data.newRectangles) {
          const newRectangles = response.data.newRectangles;
          for (const rectangle of newRectangles) {
            if (!rectangle.id) {
              rectangle.id = crypto.randomUUID();
            }
          }
          const updatedRectangles = [...oldRectangles, ...newRectangles];
          await db.brochure.update({
            where: { id: input.brochureId },
            data: { inpaintedRectangles: updatedRectangles },
          });

          return { newRectangles };
        } else {
          throw new Error(
            "Request to inpaint rectangles failed" + response.statusText,
          );
        }
      } catch (error) {
        console.error("Error removing objects:", error);
        throw error;
      }
    },

    updateTextToRemove: async (
      brochureId: string,
      textToRemove: TransformedTextContent[],
    ) => {
      await db.brochure.update({
        where: { id: brochureId },
        data: { textToRemove },
      });
    },

    updatePathsToRemove: async (brochureId: string, pathsToRemove: Path[]) => {
      await db.brochure.update({
        where: { id: brochureId },
        data: { pathsToRemove },
      });
    },

    updateUndoStack: async (brochureId: string, undoStack: string[]) => {
      await db.brochure.update({
        where: { id: brochureId },
        data: { undoStack },
      });
    },

    updateDeletedPages: async (brochureId: string, deletedPages: number[]) => {
      await db.brochure.update({
        where: { id: brochureId },
        data: { deletedPages },
      });
    },

    updateExportedUrl: async (brochureId: string, exportedUrl: string) => {
      await db.brochure.update({
        where: { id: brochureId },
        data: { exportedUrl },
      });
    },
  };
};
