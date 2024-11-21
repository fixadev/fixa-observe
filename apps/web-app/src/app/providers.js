// app/providers.js
"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "", {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    session_recording: {
      maskAllInputs: false,
      maskInputOptions: {
        password: true, // Highly recommended as a minimum!!
      },
    },
  });
}
// @ts-expect-error this is not a typescript file.
export function CSPostHogProvider({ children }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
