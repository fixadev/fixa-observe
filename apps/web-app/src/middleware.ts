import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPrivateRoute = createRouteMatcher(["/dashboard(.*)", "/observe(.*)"]);

export default clerkMiddleware((auth, req) => {
  // Skip middleware for static assets and public routes
  if (!isPrivateRoute(req)) {
    return NextResponse.next();
  }

  if (!auth().userId) {
    return auth().redirectToSignIn();
  }

  auth().protect();

  const { userId, orgId } = auth();
  if (userId && !orgId && req.nextUrl.pathname !== "/org-selection") {
    const searchParams = new URLSearchParams({
      redirectUrl: new URL(req.url).pathname, // Only store pathname instead of full URL
    });

    const orgSelection = new URL(
      `/org-selection?${searchParams.toString()}`,
      req.url,
    );

    return NextResponse.redirect(orgSelection);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
