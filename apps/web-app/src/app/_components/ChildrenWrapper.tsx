"use client";

import { useUser } from "@clerk/nextjs";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

// Create the ChildrenWrapper component (AuthProvider)
export default function ChildrenWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const posthog = usePostHog();
  const { user, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && user) {
        const email = user.primaryEmailAddress?.emailAddress;
        posthog.identify(email, {
          email,
          firstName: user.firstName,
          lastName: user.lastName,
        });
      } else {
        posthog.reset();
      }
    }
  }, [isLoaded, isSignedIn, user, posthog]);

  return <>{children}</>;
}
