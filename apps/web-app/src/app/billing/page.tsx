"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import Spinner from "~/components/Spinner";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { type PublicMetadata } from "@repo/types/src";
import { api } from "~/trpc/react";
import { env } from "~/env";
import { useRouter } from "next/navigation";

export default function BillingPage({
  params,
}: {
  params: { agentId: string };
}) {
  const router = useRouter();
  const { user, isLoaded: isUserLoaded } = useUser();
  const userData = useMemo(() => {
    return user?.publicMetadata as PublicMetadata | undefined;
  }, [user]);
  const hasPaymentMethod = useMemo(() => {
    return userData?.stripeCustomerId !== undefined;
  }, [userData]);

  const freeTestsLeft = useMemo(() => {
    return userData?.freeTestsLeft ?? 0;
  }, [userData]);

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

  const { data: billingDetails, isLoading: isLoadingBillingDetails } =
    api.stripe.billingDetails.useQuery();
  const { data: usageDetails, isLoading: isLoadingUsageDetails } =
    api.stripe.usageDetails.useQuery();

  const billingPeriod = useMemo(() => {
    const start = usageDetails?.currentPeriodStart;
    const end = usageDetails?.currentPeriodEnd;
    if (!start || !end) return null;
    return `${start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} - ${end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`;
  }, [usageDetails]);

  const isLoaded = useMemo(
    () => isUserLoaded && !isLoadingBillingDetails && !isLoadingUsageDetails,
    [isUserLoaded, isLoadingBillingDetails, isLoadingUsageDetails],
  );

  const totalCost = useMemo(() => {
    return (
      (usageDetails?.testingUsage ?? 0) * 0.2 +
      (usageDetails?.observabilityUsage ?? 0) * 0.03
    );
  }, [usageDetails]);

  return (
    <div className="h-full">
      <div className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-input bg-sidebar px-4 lg:h-[60px]">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            back
          </Button>
        </div>
      </div>
      <div className="max-w-lg space-y-8 p-6">
        {isLoaded ? (
          <>
            {/* Plan Section */}
            <section>
              <div className="mb-4 text-lg font-medium">current plan</div>
              {hasPaymentMethod ? (
                <>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-24 font-medium">plan</div>
                      <div>pay as you go</div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-24 font-medium">amount</div>
                      <div>$0.20 / minute</div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <div>need enterprise volume discounts?</div>
                    <Button variant="link" asChild>
                      <Link
                        href="https://cal.com/team/fixa/enterprise-pricing"
                        target="_blank"
                      >
                        talk to us
                      </Link>
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-24 font-medium">plan</div>
                      <div>free</div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-24 font-medium">amount</div>
                      <div
                        className={cn(
                          freeTestsLeft <= 0 && "text-red-500",
                          "text-sm",
                        )}
                      >
                        {freeTestsLeft} free test
                        {freeTestsLeft === 1 ? " " : "s "}
                        left
                      </div>
                    </div>
                    {freeTestsLeft <= 0 && (
                      <div className="flex w-[16.5rem] items-center gap-2 rounded-md border border-yellow-600 bg-yellow-50 p-1 text-sm font-medium text-muted-foreground text-yellow-600">
                        <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
                        upgrade now to continue using fixa.
                      </div>
                    )}
                  </div>
                  <Button
                    className="mt-2 w-[16.5rem]"
                    onClick={upgradePlan}
                    disabled={isGeneratingStripeUrl}
                  >
                    {isGeneratingStripeUrl ? (
                      <Spinner className="h-4 w-4" />
                    ) : (
                      "upgrade"
                    )}
                  </Button>
                  <div className="mt-1 w-[16.5rem] text-xs text-muted-foreground">
                    usage based pricing. only pay for what you use.
                  </div>
                </>
              )}
            </section>

            {/* Billing Details Section */}
            {hasPaymentMethod && billingDetails && (
              <section>
                <div className="mb-4 text-lg font-medium">billing details</div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-24 font-medium">name</div>
                    <div>{billingDetails.name}</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-24 font-medium">email</div>
                    <div>{billingDetails.email}</div>
                  </div>
                </div>
                <Button variant="outline" className="mt-4" asChild>
                  <Link
                    href={`${env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL}?prefilled_email=${billingDetails.email}`}
                    target="_blank"
                  >
                    edit info
                  </Link>
                </Button>
              </section>
            )}

            {/* Usage Section */}
            {usageDetails && (
              <section>
                <div className="mb-4 text-lg font-medium">usage</div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-24 font-medium">period</div>
                    <div>{billingPeriod}</div>
                  </div>
                  <div className="flex items-baseline gap-2 text-sm">
                    <div className="w-24 font-medium">testing</div>
                    <div className="flex items-baseline gap-2">
                      <div>{usageDetails.testingUsage} minutes</div>
                      <div className="text-xs text-muted-foreground">
                        ($0.20 / minute)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 text-sm">
                    <div className="w-24 font-medium">observability</div>
                    <div className="flex items-baseline gap-2">
                      <div>{usageDetails.observabilityUsage} minutes</div>
                      <div className="text-xs text-muted-foreground">
                        ($0.03 / minute)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 text-sm">
                    <div className="w-24 font-medium">total</div>
                    <div className="text-lg font-medium">
                      ${totalCost.toFixed(2)}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </>
        ) : (
          <>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </>
        )}
      </div>
    </div>
  );
}
