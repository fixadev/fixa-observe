import { Request, Response, Router } from "express";
import { validateUploadCallParams } from "../../../middlewares/validateParams";
import { addCallToQueue } from "../../../services/aws";
import { clerkServiceClient } from "../../../clients/clerkServiceClient";
import { posthogClient } from "../../../clients/posthogClient";

const uploadCallRouter = Router();

uploadCallRouter.post(
  "/",
  validateUploadCallParams,
  async (req: Request, res: Response) => {
    try {
      const {
        callId,
        stereoRecordingUrl,
        agentId,
        metadata,
        createdAt,
        saveRecording,
        language,
        scenario,
      } = req.body;

      // Determine whether to decrement free calls left
      try {
        const metadata = await clerkServiceClient.getPublicMetadata({
          orgId: res.locals.orgId,
        });
        const bypassPayment = await posthogClient.getFeatureFlag(
          "bypass-payment",
          res.locals.orgId,
          {
            groups: {
              organization: res.locals.orgId,
            },
          },
        );
        if (metadata.stripeCustomerId || bypassPayment) {
          // User is paid user!
        } else {
          // User is free user! Decrement free calls left
          if (
            metadata.freeObservabilityCallsLeft &&
            metadata.freeObservabilityCallsLeft > 0
          ) {
            await clerkServiceClient.decrementFreeObservabilityCallsLeft({
              orgId: res.locals.orgId,
            });
          } else {
            return res
              .status(403)
              .json({ success: false, error: "no free calls left" });
          }
        }
      } catch (error) {}

      await addCallToQueue({
        callId,
        stereoRecordingUrl: stereoRecordingUrl,
        agentId,
        createdAt: createdAt || new Date().toISOString(),
        ownerId: res.locals.orgId,
        metadata: metadata,
        saveRecording,
        language,
        scenario,
      });
      res.json({ success: true, callId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  },
);

export { uploadCallRouter };
