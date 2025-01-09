import { Request, Response, NextFunction } from "express";
import { getNumberOfAudioChannels } from "../utils/audio";

export const validateUploadCallParams = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { callId, stereoRecordingUrl, agentId } = req.body;

  const missingFields = [];
  if (!callId) missingFields.push("callId");
  if (!stereoRecordingUrl) missingFields.push("stereoRecordingUrl");
  if (!agentId) missingFields.push("agentId");
  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      error: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  try {
    const numberOfChannels = await getNumberOfAudioChannels(stereoRecordingUrl);
    if (numberOfChannels !== 2) {
      return res.status(400).json({
        success: false,
        error: "Audio file must be stereo (2 channels)",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      error:
        "Could not verify audio channels. Please ensure the URL points to a valid stereo audio file.",
    });
  }

  next();
};
