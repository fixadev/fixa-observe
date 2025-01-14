"use client";

import { type SavedSearchWithIncludes } from "@repo/types/src";
import { ObserveStateProvider } from "~/components/hooks/useObserveState";
import ObserveSidebar from "~/components/observe/ObserveSidebar";
import Spinner from "~/components/Spinner";
import { SidebarProvider } from "~/components/ui/sidebar";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loaded = true;
  const demoCalls = {};
  const demoSavedSearches: SavedSearchWithIncludes[] = [];

  if (!loaded) {
    return (
      <div className="flex size-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <ObserveStateProvider
      isDemo
      demoCalls={demoCalls}
      demoSavedSearches={demoSavedSearches}
    >
      <SidebarProvider>
        <ObserveSidebar />
        <main className="flex-1">{children}</main>
      </SidebarProvider>
    </ObserveStateProvider>
  );
}
