import { Request, Response, NextFunction } from "express";

export const validateUploadCallParams = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { callId, location, agentId, metadata } = req.body;

  const missingFields = [];
  if (!callId) missingFields.push("callId");
  if (!location) missingFields.push("location");
  if (!agentId) missingFields.push("agentId");
  if (!metadata) missingFields.push("metadata");
  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      error: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  next();
};
