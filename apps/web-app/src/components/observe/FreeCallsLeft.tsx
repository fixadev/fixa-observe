"use client";

import { useOrganization } from "~/helpers/useSelfHostedAuth";
import { type PublicMetadata } from "@repo/types/src";
import { useCallback, useMemo } from "react";
import { Button } from "../ui/button";
import { api } from "~/trpc/react";
import Spinner from "../Spinner";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { Card } from "../ui/card";

export default function FreeCallsLeft() {
  const bypassPayment = useFeatureFlagEnabled("bypass-payment");
  const { organization, isLoaded } = useOrganization();

  const metadata = organization?.publicMetadata as PublicMetadata | undefined;

  const freeCallsLeft = useMemo(() => {
    return metadata?.freeObservabilityCallsLeft ?? 0;
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
  if (isPaidUser || !isLoaded) {
    return null;
  }

  return (
    <div className="my-4 flex size-full items-center justify-center">
      <Card className="flex w-64 flex-col gap-4 p-4">
        <div className="flex flex-col gap-1">
          <div className="font-medium">{freeCallsLeft} free calls left</div>
          {freeCallsLeft === 0 && (
            <div className="text-sm text-muted-foreground">
              upgrade to continue using fixa!
            </div>
          )}
        </div>
        <Button onClick={upgradePlan} disabled={isGeneratingStripeUrl}>
          {isGeneratingStripeUrl ? <Spinner /> : "upgrade now"}
        </Button>
      </Card>
    </div>
  );
}
