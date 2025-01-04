import "~/styles/globals.css";

import { Toaster } from "@/components/ui/toaster";
import { TRPCReactProvider } from "~/trpc/react";
import { ibmPlexSans } from "./fonts";
import { CSPostHogProvider } from "./providers";
import { ClerkProvider } from "@clerk/nextjs";

// import { dark } from "@clerk/themes";
import { PostHogIdentify } from "./_components/PostHogIdentify";
import { TooltipProvider } from "~/components/ui/tooltip";

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
      <CSPostHogProvider>
        <ClerkProvider
        // appearance={{ baseTheme: dark }}
        // localization={localization}
        >
          <body className="h-full">
            {/* <ThemeProvider
              attribute="class"
              defaultTheme="light"
              // enableSystem
              disableTransitionOnChange
            > */}
            <TRPCReactProvider>
              <TooltipProvider delayDuration={100}>
                {children}
                <Toaster />
                <PostHogIdentify />
              </TooltipProvider>
            </TRPCReactProvider>
            {/* </ThemeProvider> */}
          </body>
        </ClerkProvider>
      </CSPostHogProvider>
    </html>
  );
}
