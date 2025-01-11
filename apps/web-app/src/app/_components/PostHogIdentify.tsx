"use client";

import { useOrganization, useUser } from "~/helpers/useSelfHostedAuth";
import { usePostHog } from "posthog-js/react";
import { useEffect, useRef } from "react";

// Create the ChildrenWrapper component (AuthProvider)
export function PostHogIdentify() {
  const posthog = usePostHog();
  const { user, isLoaded, isSignedIn } = useUser();
  const prevUserId = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && user) {
        if (prevUserId.current !== user.id) {
          const email = user.primaryEmailAddress?.emailAddress;
          // console.log("IDENTIFYING USER", user.id, email);
          posthog.identify(user.id, {
            email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
          });
          prevUserId.current = user.id;
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, user]);

  const { organization, isLoaded: organizationLoaded } = useOrganization();
  const prevOrganizationId = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (organizationLoaded && organization) {
      if (
        !prevOrganizationId.current ||
        prevOrganizationId.current !== organization.id
      ) {
        // console.log("GROUPING ORGANIZATION", organization.id);
        posthog.group("organization", organization.id, {
          id: organization.id,
          name: organization.name,
        });
      }
      prevOrganizationId.current = organization.id;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization]);

  return null;
}
