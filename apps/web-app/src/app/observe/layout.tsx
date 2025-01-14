"use client";

import { ObserveStateProvider } from "~/components/hooks/useObserveState";
import ObserveSidebar from "~/components/observe/ObserveSidebar";
import { SidebarProvider } from "~/components/ui/sidebar";
import { useOrganization } from "@clerk/nextjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { type PublicMetadata } from "@repo/types/src";
import Spinner from "~/components/Spinner";

export default function ObserveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { organization, isLoaded } = useOrganization();
  const [isOnboarded, setIsOnboarded] = useState(false);

  const checkIsOnboarded = useCallback(() => {
    console.log(
      "======================================== Checking if onboarded! =============================================",
    );
    if (!organization) return;
    const metadata = organization.publicMetadata as PublicMetadata;
    if (metadata.onboarded) {
      setIsOnboarded(true);
    } else {
      setTimeout(() => {
        void organization?.reload().then(() => {
          checkIsOnboarded();
        });
      }, 1000);
    }
  }, [organization]);

  useEffect(() => {
    if (isLoaded) {
      checkIsOnboarded();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  if (!isOnboarded) {
    return (
      <div className="flex size-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <ObserveStateProvider>
      <SidebarProvider>
        <ObserveSidebar />
        <main className="flex-1">{children}</main>
      </SidebarProvider>
    </ObserveStateProvider>
  );
}
