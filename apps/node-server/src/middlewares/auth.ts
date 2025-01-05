import { Request, Response, NextFunction } from "express";
import { db } from "../db";

export const authenticateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  // Extract token from Bearer header
  const token = authHeader?.split(" ")[1];

  if (!authHeader || !token || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Invalid or missing Bearer token",
    });
  }

  const apiKeyRecord = await db.apiKey.findFirst({
    where: {
      apiKey: token,
    },
  });

  if (!apiKeyRecord) {
    return res.status(401).json({
      success: false,
      error: "Invalid Bearer token",
    });
  }

  res.locals.orgId = apiKeyRecord.orgId;
  next();
};
