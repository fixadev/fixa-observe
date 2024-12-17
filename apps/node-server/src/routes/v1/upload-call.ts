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
        saveRecording,
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
        stereoRecordingUrl: location || stereoRecordingUrl,
        agentId,
        createdAt: createdAt || new Date().toISOString(),
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
