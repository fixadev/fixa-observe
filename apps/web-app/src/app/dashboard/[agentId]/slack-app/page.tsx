"use client";

import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { InstallSlackAppButton } from "~/components/SlackButton";

export default function SlackAppPage({
  params,
}: {
  params: { agentId: string };
}) {
  return (
    <div>
      <div className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-input bg-sidebar px-4 lg:h-[60px]">
        <div className="flex flex-1 items-center gap-2">
          <SidebarTrigger />
          <Link href={`/dashboard/${params.agentId}/slack-app`}>
            <div className="font-medium">slack app</div>
          </Link>
        </div>
      </div>
      <div className="container flex flex-col gap-4 p-4">
        <Card>
          <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <CardTitle>install slack app</CardTitle>
              <CardDescription>
                get notified when tests complete
              </CardDescription>
            </div>
            <InstallSlackAppButton agentId={params.agentId} />
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
