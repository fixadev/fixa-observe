import { Request, Response, Router } from "express";
import { validateUploadCallParams } from "../../middlewares/validateParams";
import { addCallToQueue } from "../../services/aws";
import userServiceClient from "../../clients/userServiceClient";
import { PublicMetadata } from "@repo/types/src";
import { env } from "../../env";

const uploadCallRouter = Router();

uploadCallRouter.post(
  "/",
  validateUploadCallParams,
  async (req: Request, res: Response) => {
    try {
      const {
        callId,
        location,
        stereoRecordingUrl,
        agentId,
        regionId,
        metadata,
        createdAt,
        saveRecording = true,
      } = req.body;

      if (regionId) metadata.regionId = regionId;

      // Determine whether to decrement free calls left
      try {
        const user = await userServiceClient.getUser(res.locals.userId);
        if (user?.publicMetadata) {
          const metadata = user.publicMetadata as PublicMetadata;
          if (
            metadata.stripeCustomerId ||
            user.id === env.NEXT_PUBLIC_11X_USER_ID
          ) {
            // User is paid user!
          } else {
            // User is free user! Decrement free calls left
            if (
              metadata.freeObservabilityCallsLeft &&
              metadata.freeObservabilityCallsLeft > 0
            ) {
              await userServiceClient.decrementFreeObservabilityCallsLeft(
                res.locals.userId,
              );
            } else {
              return res
                .status(403)
                .json({ success: false, error: "no free calls left" });
            }
          }
        }
      } catch (error) {}

      console.log(
        "ADDING CALL TO QUEUE",
        callId,
        "with user id",
        res.locals.userId,
      );

      await addCallToQueue({
        callId,
        location: location || stereoRecordingUrl,
        agentId,
        createdAt: createdAt ? new Date(createdAt) : new Date(),
        userId: res.locals.userId,
        metadata: metadata,
        saveRecording,
      });
      res.json({ success: true, you: "are cool :)" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  },
);

export default uploadCallRouter;
