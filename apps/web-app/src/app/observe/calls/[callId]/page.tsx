"use client";

import CallDetails from "~/components/dashboard/CallDetails";
import { AudioProvider } from "~/components/hooks/useAudio";
import { TEST_OBSERVE_CALLS } from "~/lib/test-data";
import { api } from "~/trpc/react";

export default function CallPage({ params }: { params: { callId: string } }) {
  const { data: call } = api._call.getCall.useQuery(params.callId);
  console.log(call);
  return (
    <AudioProvider>
      <CallDetails
        call={TEST_OBSERVE_CALLS[0]!}
        botName="jordan"
        userName="caller"
        headerHeight={0}
        avatarUrl="/images/agent-avatars/jordan.png"
        type="latency"
      />
    </AudioProvider>
  );
}
