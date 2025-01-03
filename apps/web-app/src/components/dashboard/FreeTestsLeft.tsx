"use client";

import { useUser } from "@clerk/nextjs";
import { type PublicMetadata } from "@repo/types/src";
import { useCallback, useMemo } from "react";
import { Button } from "../ui/button";
import { api } from "~/trpc/react";
import Spinner from "../Spinner";
import { useFeatureFlagEnabled } from "posthog-js/react";

export default function FreeTestsLeft() {
  const bypassPayment = useFeatureFlagEnabled("bypass-payment");
  const { user, isLoaded } = useUser();

  const metadata = user?.publicMetadata as PublicMetadata | undefined;

  const freeTestsLeft = useMemo(() => {
    return metadata?.freeTestsLeft ?? 0;
  }, [metadata]);

  const isPaidUser = useMemo(() => {
    return !!metadata?.stripeCustomerId || bypassPayment;
  }, [metadata, bypassPayment]);

  const { mutate: getCheckoutUrl, isPending: isGeneratingStripeUrl } =
    api.stripe.createCheckoutUrl.useMutation({
      onSuccess: (data) => {
        window.location.href = data.checkoutUrl;
      },
    });
  const upgradePlan = useCallback(async () => {
    const redirectUrl = window.location.href;
    getCheckoutUrl({ redirectUrl });
  }, [getCheckoutUrl]);

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  if ((isPaidUser && freeTestsLeft === 0) || !isLoaded) {
    return null;
  }

  return (
    <div className="-mx-2 mb-4 flex flex-col gap-4 rounded-md border border-border bg-background p-4 shadow-sm">
      <div className="flex flex-col gap-1">
        <div className="text-base font-medium">
          {freeTestsLeft} free tests left
        </div>
        {freeTestsLeft === 0 && (
          <div className="text-sm text-muted-foreground">
            upgrade to continue using fixa!
          </div>
        )}
      </div>
      {isPaidUser ? (
        <div className="text-sm text-muted-foreground">
          you will not be charged until your free tests run out
        </div>
      ) : (
        <Button onClick={upgradePlan} disabled={isGeneratingStripeUrl}>
          {isGeneratingStripeUrl ? <Spinner /> : "upgrade now"}
        </Button>
      )}
    </div>
  );
}
