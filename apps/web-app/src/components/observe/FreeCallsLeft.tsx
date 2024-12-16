"use client";

import { useUser } from "@clerk/nextjs";
import { type PublicMetadata } from "@repo/types/src";
import { useCallback, useMemo } from "react";
import { Button } from "../ui/button";
import { api } from "~/trpc/react";
import Spinner from "../Spinner";
import { env } from "~/env";
import { Card } from "../ui/card";

export default function FreeCallsLeft() {
  const { user, isLoaded } = useUser();

  const metadata = user?.publicMetadata as PublicMetadata | undefined;

  const freeCallsLeft = useMemo(() => {
    return metadata?.freeObservabilityCallsLeft ?? 0;
  }, [metadata]);

  const isPaidUser = useMemo(() => {
    return (
      !!metadata?.stripeCustomerId || user?.id === env.NEXT_PUBLIC_11X_USER_ID
    );
  }, [metadata, user]);

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

  if (isPaidUser || !isLoaded) {
    return null;
  }

  return (
    <div className="my-4 flex size-full items-center justify-center">
      <Card className="flex w-64 flex-col gap-2 p-4">
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
