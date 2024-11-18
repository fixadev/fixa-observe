import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "./server/db";

const isPrivateRoute = createRouteMatcher(["/dashboard(.*)"]);
const isApiKeyRoute = createRouteMatcher(["/api/tests(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isPrivateRoute(req)) {
    auth().protect();
  }

  return apiMiddleware(req);
});

async function apiMiddleware(req: NextRequest): Promise<NextResponse> {
  // If the request is for the tests API, validate the API key
  if (isApiKeyRoute(req)) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = authHeader.substring(7); // Remove 'Bearer ' prefix
    const apiKeyRecord = await db.apiKey.findFirst({
      where: { apiKey },
    });

    if (!apiKeyRecord) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Augment the request object with userId
    req.userId = apiKeyRecord.userId;

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
