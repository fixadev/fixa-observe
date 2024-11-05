import "~/styles/globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import { ibmPlexSans } from "./fonts";
import { CSPostHogProvider } from "./providers";
import { ClerkProvider } from "@clerk/nextjs";

// import { dark } from "@clerk/themes";
import ChildrenWrapper from "./_components/ChildrenWrapper";
import { TooltipProvider } from "~/components/ui/tooltip";
export const metadata: Metadata = {
  title: "pixa",
  description: "the observability platform for voice AI",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${ibmPlexSans.className} light`}
      style={{ colorScheme: "light" }}
    >
      <CSPostHogProvider>
        <ClerkProvider
        // appearance={{ baseTheme: dark }}
        // localization={localization}
        >
          <body>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              // enableSystem
              disableTransitionOnChange
            >
              <TRPCReactProvider>
                <TooltipProvider delayDuration={100}>
                  <ChildrenWrapper>
                    {children}
                    <Toaster />
                  </ChildrenWrapper>
                </TooltipProvider>
              </TRPCReactProvider>
            </ThemeProvider>
          </body>
        </ClerkProvider>
      </CSPostHogProvider>
    </html>
  );
}
