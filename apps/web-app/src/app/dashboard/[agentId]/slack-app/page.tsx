"use client";

import { useUser } from "@clerk/nextjs";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { env } from "~/env";

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

function InstallSlackAppButton({ agentId }: { agentId: string }) {
  const { user } = useUser();

  const slackWebhookUrl = useMemo(
    () => user?.publicMetadata.slackWebhookUrl,
    [user],
  );

  const state = useMemo(() => {
    return JSON.stringify({ agentId, origin: "dashboard" });
  }, [agentId]);

  const href = useMemo(() => {
    return `https://slack.com/oauth/v2/authorize?scope=chat%3Awrite%2Cincoming-webhook&user_scope=&redirect_uri=${encodeURIComponent(
      env.NEXT_PUBLIC_SLACK_REDIRECT_URI,
    )}&client_id=${env.NEXT_PUBLIC_SLACK_CLIENT_ID}&state=${encodeURIComponent(
      state,
    )}`;
  }, [state]);

  const [isHovering, setIsHovering] = useState(false);

  return (
    <Button
      variant="outline"
      asChild
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <a
        href={href}
        className="flex w-full items-center justify-center sm:w-48"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{
            height: "20px",
            width: "20px",
            marginRight: "12px",
          }}
          viewBox="0 0 122.8 122.8"
        >
          <path
            d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z"
            fill="#e01e5a"
          ></path>
          <path
            d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z"
            fill="#36c5f0"
          ></path>
          <path
            d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z"
            fill="#2eb67d"
          ></path>
          <path
            d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"
            fill="#ecb22e"
          ></path>
        </svg>
        {slackWebhookUrl ? (
          isHovering ? (
            "re-install"
          ) : (
            <span className="flex items-center gap-2">
              added to slack
              <CheckCircleIcon className="h-4 w-4 text-green-500" />
            </span>
          )
        ) : (
          "add to slack"
        )}
      </a>
    </Button>
  );
}
