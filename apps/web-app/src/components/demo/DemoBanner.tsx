"use client";

import { SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { useCallback } from "react";

export function DemoBanner() {
  const { isLoaded } = useAuth();

  const goToDashboard = useCallback(() => {
    window.location.href = "/observe";
  }, []);

  return (
    <div
      className={cn(
        "-mx-2 -mb-2 flex flex-col gap-3 rounded-lg border border-border bg-background p-4",
        isLoaded ? "flex" : "hidden",
      )}
    >
      <p className="text-sm text-muted-foreground">
        you are viewing a read-only demo of fixa.
      </p>
      <div className="flex w-full flex-col items-stretch gap-2">
        <SignedOut>
          <Button asChild size="sm">
            <Link href="/sign-up">sign up for free</Link>
          </Button>
          <Button variant="outline" asChild size="sm">
            <Link href="/">back to homepage</Link>
          </Button>
        </SignedOut>
        <SignedIn>
          <Button variant="outline" size="sm" onClick={goToDashboard}>
            back to dashboard
          </Button>
        </SignedIn>
      </div>
    </div>
  );
}
