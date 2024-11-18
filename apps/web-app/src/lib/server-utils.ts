"use server";

import type { NextRequest } from "next/server";
import { db } from "~/server/db";

export async function getUserIdFromApiKey(req: NextRequest) {
  // If the request is for the tests API, validate the API key
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return null;
  }

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const apiKey = authHeader.substring(7); // Remove 'Bearer ' prefix
  const apiKeyRecord = await db.apiKey.findFirst({
    where: { apiKey },
  });

  if (!apiKeyRecord) {
    return null;
  }

  // Augment the request object with userId
  return apiKeyRecord.userId;
}
