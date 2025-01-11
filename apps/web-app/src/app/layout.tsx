import "~/styles/globals.css";

import { Toaster } from "@/components/ui/toaster";
import { TRPCReactProvider } from "~/trpc/react";
import { ibmPlexSans } from "./fonts";
import { CSPostHogProvider } from "./providers";
// import { ClerkProvider } from "@clerk/nextjs";

// import { dark } from "@clerk/themes";
import { PostHogIdentify } from "./_components/PostHogIdentify";
import { TooltipProvider } from "~/components/ui/tooltip";
import { AudioSettingsProvider } from "~/components/hooks/useAudioSettings";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "fixa | open source voice agent observability",
  description:
    "monitor latency, interruptions, and correctness of your production calls to debug and improve your voice agent.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "fixa | open source voice agent observability",
    description:
      "monitor latency, interruptions, and correctness of your production calls to debug and improve your voice agent.",
    images: [
      {
        url: "/images/landing-page/og-image.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${ibmPlexSans.className} light h-full`}
      style={{ colorScheme: "light" }}
      // suppressHydrationWarning
    >
      {/* <CSPostHogProvider> */}
      {/* <ClerkProvider
          afterSignOutUrl="/"
          // appearance={{ baseTheme: dark }}
          // localization={localization}
        > */}
      <body className="h-full">
        {/* <ThemeProvider
                attribute="class"
                defaultTheme="light"
                // enableSystem
                disableTransitionOnChange
              > */}
        <TRPCReactProvider>
          <TooltipProvider delayDuration={100}>
            <AudioSettingsProvider>
              {children}
              <Toaster />
              <PostHogIdentify />
            </AudioSettingsProvider>
          </TooltipProvider>
        </TRPCReactProvider>
        {/* </ThemeProvider> */}
      </body>
      {/* </ClerkProvider>
      </CSPostHogProvider> */}
    </html>
  );
}
