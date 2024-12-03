import { Request, Response, NextFunction } from "express";
import { env } from "../env";
import { db } from "../db";

export const authenticateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: "Invalid or missing API key",
    });
  }

  const apiKeyRecord = await db.apiKey.findFirst({
    where: {
      apiKey: apiKey as string,
    },
  });

  if (!apiKeyRecord) {
    return res.status(401).json({
      success: false,
      error: "Invalid or missing API key",
    });
  }
  res.locals.userId = apiKeyRecord.userId;
  next();
};
