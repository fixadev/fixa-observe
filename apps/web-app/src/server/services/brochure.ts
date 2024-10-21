import { type PrismaClient } from "@prisma/client";
import {
  brochureRectangles,
  type BrochureRectangles,
  type Path,
  type RemoveRectanglesInput,
  type TransformedTextContent,
} from "~/lib/property";
import axios from "axios";
import { env } from "~/env";

export const brochureService = ({ db }: { db: PrismaClient }) => {
  return {
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

    setTextToRemove: async (
      brochureId: string,
      textToRemove: TransformedTextContent[],
    ) => {
      await db.brochure.update({
        where: { id: brochureId },
        data: { textToRemove },
      });
    },

    setPathsToRemove: async (brochureId: string, pathsToRemove: Path[]) => {
      await db.brochure.update({
        where: { id: brochureId },
        data: { pathsToRemove },
      });
    },

    setUndoStack: async (brochureId: string, undoStack: string[]) => {
      await db.brochure.update({
        where: { id: brochureId },
        data: { undoStack },
      });
    },
  };
};
