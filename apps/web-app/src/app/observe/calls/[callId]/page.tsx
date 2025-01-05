"use client";

import CallDetails from "~/components/dashboard/CallDetails";
import Spinner from "~/components/Spinner";
import { api } from "~/trpc/react";

export default function CallPage({ params }: { params: { callId: string } }) {
  const { data: call } = api._call.getCall.useQuery(params.callId);

  if (!call) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spinner className="size-5" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <CallDetails
        call={call}
        botName="agent"
        userName="caller"
        headerHeight={44}
        includeHeaderTop={false}
        avatarUrl="/images/agent-avatars/jordan.png"
        type="latency"
      />
    </div>
  );
}
