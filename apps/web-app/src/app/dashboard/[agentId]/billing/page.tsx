import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SidebarTrigger } from "~/components/ui/sidebar";

export default function BillingPage({
  params,
}: {
  params: { agentId: string };
}) {
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
        </section>

        {/* Billing Details Section */}
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
