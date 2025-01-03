import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPrivateRoute = createRouteMatcher(["/dashboard(.*)", "/observe(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isPrivateRoute(req)) {
    auth().protect();

    const { userId, orgId } = auth();
    // Redirect signed in users to organization selection page if they are not active in an organization
    if (userId && !orgId && req.nextUrl.pathname !== "/org-selection") {
      const searchParams = new URLSearchParams({ redirectUrl: req.url });

      const orgSelection = new URL(
        `/org-selection?${searchParams.toString()}`,
        req.url,
      );

      return NextResponse.redirect(orgSelection);
    }
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
