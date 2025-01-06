import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { env } from "../env";

export const authenticatePublicRequest = async (
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

export const authenticateInternalRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apiKey = req.headers["x-internal-secret"];
  if (apiKey !== env.NODE_SERVER_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

export const authenticateVapiRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apiKey = req.headers["x-vapi-secret"];
  if (apiKey !== env.NODE_SERVER_SECRET) {
    console.log("Unauthorized vapi request", apiKey, env.NODE_SERVER_SECRET);
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};
