"use client";

import CallDetails from "~/components/dashboard/CallDetails";
import { AudioProvider, useAudio } from "~/components/hooks/useAudio";
import { TEST_OBSERVE_CALLS } from "~/lib/test-data";
import { api } from "~/trpc/react";

export function CallPage({ params }: { params: { callId: string } }) {
  // const { data: call } = api._call.getCall.useQuery(params.callId);
  // console.log(call);

  const { play, pause, isPlaying } = useAudio();
  return (
    <div
      className="h-screen w-screen"
      autoFocus
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === " ") {
          e.preventDefault();
          if (isPlaying) {
            pause();
          } else {
            play();
          }
        }
      }}
    >
      <CallDetails
        call={TEST_OBSERVE_CALLS[0]!}
        botName="jordan"
        userName="caller"
        headerHeight={0}
        avatarUrl="/images/agent-avatars/jordan.png"
        type="latency"
      />
    </div>
  );
}

export default function CallPageWrapper({
  params,
}: {
  params: { callId: string };
}) {
  return (
    <AudioProvider>
      <CallPage params={params} />
    </AudioProvider>
  );
}
