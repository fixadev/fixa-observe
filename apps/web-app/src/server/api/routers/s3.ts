import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { createPresignedUrl } from "~/server/utils/s3utils";

export const s3Router = createTRPCRouter({
  getPresignedS3Url: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileType: z.string(),
        keepOriginalName: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return await createPresignedUrl(
        input.fileName,
        input.fileType,
        input.keepOriginalName,
      );
    }),
});
