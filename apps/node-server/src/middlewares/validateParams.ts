import { Request, Response, NextFunction } from "express";
import { getNumberOfAudioChannels } from "../utils/audio";
import { TemporaryScenarioSchema } from "@repo/types/src/index";

export const validateUploadCallParams = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { callId, stereoRecordingUrl, agentId, scenario } = req.body;

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

    if (scenario) {
      const parsedScenario = TemporaryScenarioSchema.safeParse(scenario);
      if (!parsedScenario.success) {
        return res.status(400).json({
          success: false,
          error: "Invalid scenario format",
        });
      }
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      error:
        "Could not verify audio file channel metadata. Please ensure the URL points to a valid stereo audio file and is accessible.",
    });
  }
  next();
};
