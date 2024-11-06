"use client";

import { useState } from "react";
import {
  Select,
  SelectValue,
  SelectItem,
  SelectContent,
  SelectTrigger,
} from "~/components/ui/select";
import CallCard from "./_components/CallCard";
import type { Call, CallStatus } from "~/lib/types";
import CallDetails from "./_components/CallDetails";

type CallType = "error" | "no-errors" | "all";

export default function DashboardPage() {
  const [selectedCallType, setSelectedCallType] = useState<CallType>("error");
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-2xl font-medium">Dashboard</h1>
      <div className="flex rounded-md border border-input shadow-sm">
        <div className="flex w-96 flex-col border-r border-input">
          <div className="border-b border-input p-2 text-lg font-medium">
            calls
          </div>
          <div className="flex items-center gap-2 border-b border-input p-2">
            <div className="text-sm">show</div>
            <Select
              value={selectedCallType}
              onValueChange={(value) => setSelectedCallType(value as CallType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="call type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="error" className="cursor-pointer">
                  calls with errors
                </SelectItem>
                <SelectItem value="no-errors" className="cursor-pointer">
                  calls without errors
                </SelectItem>
                <SelectItem value="all" className="cursor-pointer">
                  all calls
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col">
            {TEST_CALLS.filter((call) =>
              selectedCallType === "all"
                ? true
                : call.status === selectedCallType,
            ).map((call) => (
              <CallCard
                key={call.id}
                call={call}
                selectedCallId={selectedCallId}
                onSelect={setSelectedCallId}
              />
            ))}
          </div>
        </div>
        {selectedCallId && (
          <CallDetails
            call={TEST_CALLS.find((call) => call.id === selectedCallId)!}
          />
        )}
      </div>
    </div>
  );
}

const TEST_CALLS: Call[] = [
  {
    id: crypto.randomUUID(),
    status: "error" as CallStatus,
    recordingUrl:
      "https://jtuyprjjgxbgmtjiykoa.supabase.co/storage/v1/object/public/recordings/1a9a9108-95c4-4fd9-befc-a27cfb5eff69-1730766982390-5c6dd41d-32ec-4fe3-bbc1-e5f3e682a58f-mono.wav",
    summary: "Network connectivity issues during call",
    originalTranscript:
      "I'm experiencing some lag and the connection keeps dropping. Can you hear me clearly?",
    updatedTranscript:
      "I'm experiencing some lag and the connection keeps dropping. Can you hear me clearly? [Connection Issues Detected]",
  },
  {
    id: crypto.randomUUID(),
    status: "no-errors" as CallStatus,
    recordingUrl:
      "https://jtuyprjjgxbgmtjiykoa.supabase.co/storage/v1/object/public/recordings/1a9a9108-95c4-4fd9-befc-a27cfb5eff69-1730766982390-5c6dd41d-32ec-4fe3-bbc1-e5f3e682a58f-mono.wav",
    summary: "Customer inquired about account balance",
    originalTranscript: "Hi, I'd like to check my account balance please",
    updatedTranscript: "Hi, I'd like to check my account balance please",
  },
  {
    id: crypto.randomUUID(),
    status: "error" as CallStatus,
    recordingUrl:
      "https://jtuyprjjgxbgmtjiykoa.supabase.co/storage/v1/object/public/recordings/1a9a9108-95c4-4fd9-befc-a27cfb5eff69-1730766982390-5c6dd41d-32ec-4fe3-bbc1-e5f3e682a58f-mono.wav",
    summary: "Technical difficulties during call",
    originalTranscript: "I'm having trouble hearing you",
    updatedTranscript: "I'm having trouble hearing you clearly",
  },
  {
    id: crypto.randomUUID(),
    status: "no-errors" as CallStatus,
    recordingUrl:
      "https://jtuyprjjgxbgmtjiykoa.supabase.co/storage/v1/object/public/recordings/1a9a9108-95c4-4fd9-befc-a27cfb5eff69-1730766982390-5c6dd41d-32ec-4fe3-bbc1-e5f3e682a58f-mono.wav",
    summary: "Product inquiry call",
    originalTranscript: "Can you tell me more about your premium plan?",
    updatedTranscript: "Can you tell me more about your premium plan?",
  },
  {
    id: crypto.randomUUID(),
    status: "error" as CallStatus,
    recordingUrl:
      "https://jtuyprjjgxbgmtjiykoa.supabase.co/storage/v1/object/public/recordings/1a9a9108-95c4-4fd9-befc-a27cfb5eff69-1730766982390-5c6dd41d-32ec-4fe3-bbc1-e5f3e682a58f-mono.wav",
    summary: "Disconnected call",
    originalTranscript: "Hello? Are you still there?",
    updatedTranscript: "Hello? Are you still there? [Call Disconnected]",
  },
  {
    id: crypto.randomUUID(),
    status: "no-errors" as CallStatus,
    recordingUrl:
      "https://jtuyprjjgxbgmtjiykoa.supabase.co/storage/v1/object/public/recordings/1a9a9108-95c4-4fd9-befc-a27cfb5eff69-1730766982390-5c6dd41d-32ec-4fe3-bbc1-e5f3e682a58f-mono.wav",
    summary: "Subscription cancellation request",
    originalTranscript: "I would like to cancel my subscription",
    updatedTranscript: "I would like to cancel my subscription",
  },
  {
    id: crypto.randomUUID(),
    status: "error" as CallStatus,
    recordingUrl:
      "https://jtuyprjjgxbgmtjiykoa.supabase.co/storage/v1/object/public/recordings/1a9a9108-95c4-4fd9-befc-a27cfb5eff69-1730766982390-5c6dd41d-32ec-4fe3-bbc1-e5f3e682a58f-mono.wav",
    summary: "System error during payment",
    originalTranscript: "The payment isn't going through",
    updatedTranscript: "The payment isn't going through [System Error]",
  },
  {
    id: crypto.randomUUID(),
    status: "no-errors" as CallStatus,
    recordingUrl:
      "https://jtuyprjjgxbgmtjiykoa.supabase.co/storage/v1/object/public/recordings/1a9a9108-95c4-4fd9-befc-a27cfb5eff69-1730766982390-5c6dd41d-32ec-4fe3-bbc1-e5f3e682a58f-mono.wav",
    summary: "General product support",
    originalTranscript: "How do I reset my password?",
    updatedTranscript: "How do I reset my password?",
  },
  {
    id: crypto.randomUUID(),
    status: "error" as CallStatus,
    recordingUrl:
      "https://jtuyprjjgxbgmtjiykoa.supabase.co/storage/v1/object/public/recordings/1a9a9108-95c4-4fd9-befc-a27cfb5eff69-1730766982390-5c6dd41d-32ec-4fe3-bbc1-e5f3e682a58f-mono.wav",
    summary: "Audio quality issues",
    originalTranscript: "There's a lot of background noise",
    updatedTranscript: "There's a lot of background noise [Poor Audio Quality]",
  },
  {
    id: crypto.randomUUID(),
    status: "no-errors" as CallStatus,
    recordingUrl:
      "https://jtuyprjjgxbgmtjiykoa.supabase.co/storage/v1/object/public/recordings/1a9a9108-95c4-4fd9-befc-a27cfb5eff69-1730766982390-5c6dd41d-32ec-4fe3-bbc1-e5f3e682a58f-mono.wav",
    summary: "Feature request discussion",
    originalTranscript: "Is there a mobile app available?",
    updatedTranscript: "Is there a mobile app available?",
  },
].map((call, index) => ({
  ...call,
  createdAt: new Date(Date.now() - index * 10000),
  duration: Math.floor(Math.random() * (600 - 60 + 1)) + 60,
  unread: index === 0,
}));
