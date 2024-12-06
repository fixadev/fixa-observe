import { Request, Response, NextFunction } from "express";

export const validateUploadCallParams = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { callId, location, agentId, regionId, metadata, createdAt } = req.body;

  const missingFields = [];
  if (!callId) missingFields.push("callId");
  if (!location) missingFields.push("location");
  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      error: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  next();
};
