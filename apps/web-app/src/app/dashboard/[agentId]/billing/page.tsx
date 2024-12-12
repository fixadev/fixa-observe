"use client";

import { Button } from "@/components/ui/button";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import Spinner from "~/components/Spinner";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";

export default function BillingPage({
  params,
}: {
  params: { agentId: string };
}) {
  const hasPaymentMethod = useMemo(() => {
    return false;
  }, []);

  const freeTestsLeft = useMemo(() => {
    return 0;
  }, []);

  const [isGeneratingStripeUrl, setIsGeneratingStripeUrl] = useState(false);
  const upgradePlan = useCallback(async () => {
    const redirectUrl = window.location.href;
    setIsGeneratingStripeUrl(true);
    try {
      const response = await axios.post<{ url: string }>(
        "/api/stripe/checkout-sessions",
        {
          redirectUrl,
        },
      );
      window.location.href = response.data.url;
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingStripeUrl(false);
    }
  }, []);

  return (
    <div className="h-full">
      <div className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-input bg-sidebar px-4 lg:h-[60px]">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <Link href={`/dashboard/${params.agentId}/billing`}>
            <div className="font-medium">billing</div>
          </Link>
        </div>
      </div>
      <div className="max-w-lg space-y-8 p-6">
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
                    href="https://cal.com/team/fixa/fixa-enterprise"
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
                    {freeTestsLeft} free test{freeTestsLeft === 1 ? " " : "s "}
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
        {hasPaymentMethod && (
          <section>
            <div className="mb-4 text-lg font-medium">billing details</div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-24 font-medium">name</div>
                <div>jonathan liu</div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-24 font-medium">email</div>
                <div>jonathan@fixa.dev</div>
              </div>
            </div>
            <Button variant="outline" className="mt-4">
              edit info
            </Button>
          </section>
        )}

        {/* Usage Section */}
        <section>
          <div className="mb-4 text-lg font-medium">usage</div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-24 font-medium">period</div>
              <div>dec 11, 2024 - dec 12, 2024</div>
            </div>
            <div className="flex items-baseline gap-2 text-sm">
              <div className="w-24 font-medium">usage</div>
              <div className="flex items-baseline gap-2">
                <div>120 minutes</div>
                <div className="text-xs text-muted-foreground">
                  ($0.20 / minute)
                </div>
              </div>
            </div>
            <div className="flex items-baseline gap-2 text-sm">
              <div className="w-24 font-medium">total</div>
              <div className="text-lg font-medium">$24.00</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
