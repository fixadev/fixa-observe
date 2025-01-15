"use client";

import { useOrganization } from "@clerk/nextjs";
import { useCallback, useEffect } from "react";
import { type PublicMetadata } from "@repo/types/src";
import Spinner from "~/components/Spinner";
import { useRouter } from "next/navigation";

export default function OnboardPage() {
  const router = useRouter();
  const { organization, isLoaded } = useOrganization();

  const checkIsOnboarded = useCallback(() => {
    if (!organization) return;
    const metadata = organization.publicMetadata as PublicMetadata;
    if (metadata.onboarded) {
      router.push("/observe");
    } else {
      setTimeout(() => {
        void organization?.reload().then(() => {
          checkIsOnboarded();
        });
      }, 1000);
    }
  }, [organization, router]);

  useEffect(() => {
    if (isLoaded) {
      checkIsOnboarded();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  return (
    <div className="flex size-full items-center justify-center">
      <div className="flex items-center gap-4">
        <Spinner />
        {/* <div>setting up your account...</div> */}
      </div>
    </div>
  );
}
