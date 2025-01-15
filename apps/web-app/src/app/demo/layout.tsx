"use client";

import {
  type CallWithIncludes,
  type SavedSearchWithIncludes,
} from "@repo/types/src";
import { ObserveStateProvider } from "~/components/hooks/useObserveState";
import ObserveSidebar from "~/components/observe/ObserveSidebar";
import Spinner from "~/components/Spinner";
import { SidebarProvider } from "~/components/ui/sidebar";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loaded = true;
  const demoCalls: Record<string, CallWithIncludes> = {};
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
        <main className="flex-1">
          {children}
          <div className="fixed bottom-4 left-1/2 flex -translate-x-1/2 flex-col gap-3 rounded-lg border border-border bg-white p-4 shadow-lg">
            <p className="text-center text-sm text-muted-foreground">
              you are viewing a read-only demo of fixa.
            </p>
            <div className="flex w-full items-center justify-center gap-2">
              <SignedOut>
                <Button variant="outline" asChild>
                  <Link href="/">back to homepage</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up">sign up for free</Link>
                </Button>
              </SignedOut>
              <SignedIn>
                <Button variant="outline" asChild>
                  <Link href="/observe">back to dashboard</Link>
                </Button>
              </SignedIn>
            </div>
          </div>
        </main>
      </SidebarProvider>
    </ObserveStateProvider>
  );
}
