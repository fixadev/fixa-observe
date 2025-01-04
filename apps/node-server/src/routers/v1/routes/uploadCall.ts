import { Request, Response, Router } from "express";
import { validateUploadCallParams } from "../../../middlewares/validateParams";
import { addCallToQueue } from "../../../services/aws";
import { clerkServiceClient } from "../../../clients/clerkServiceClient";
import { PublicMetadata } from "@repo/types/src/index";
import { posthogClient } from "../../../clients/posthogClient";

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
        saveRecording,
        language,
      } = req.body;

      if (regionId) metadata.regionId = regionId;

      // Determine whether to decrement free calls left
      try {
        const user = await clerkServiceClient.getUser(res.locals.orgId);
        if (user?.publicMetadata) {
          const metadata = user.publicMetadata as PublicMetadata;
          const bypassPayment = await posthogClient.getFeatureFlag(
            "bypass-payment",
            user.id,
          );
          if (metadata.stripeCustomerId || bypassPayment) {
            // User is paid user!
          } else {
            // User is free user! Decrement free calls left
            if (
              metadata.freeObservabilityCallsLeft &&
              metadata.freeObservabilityCallsLeft > 0
            ) {
              await clerkServiceClient.decrementFreeObservabilityCallsLeft(
                res.locals.orgId,
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
        "with org id",
        res.locals.orgId,
      );

      await addCallToQueue({
        callId,
        stereoRecordingUrl: location || stereoRecordingUrl,
        agentId,
        createdAt: createdAt || new Date().toISOString(),
        userId: res.locals.orgId,
        metadata: metadata,
        saveRecording,
        language,
      });
      res.json({ success: true, you: "are cool :)" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  },
);

export default uploadCallRouter;
