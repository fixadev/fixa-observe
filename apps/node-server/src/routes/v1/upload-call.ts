import { Request, Response, Router } from "express";
import { validateUploadCallParams } from "../../middlewares/validateParams";
import { addCallToQueue } from "../../services/aws";

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
      } = req.body;

      if (regionId) metadata.regionId = regionId;

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
      });
      res.json({ success: true, muizz: "the man" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  },
);

export default uploadCallRouter;
