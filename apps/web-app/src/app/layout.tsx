import "~/styles/globals.css";

import { Toaster } from "@/components/ui/toaster";
import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import { ibmPlexSans } from "./fonts";
import { CSPostHogProvider } from "./providers";
import { ClerkProvider } from "@clerk/nextjs";

// import { dark } from "@clerk/themes";
import ChildrenWrapper from "./_components/ChildrenWrapper";
import { TooltipProvider } from "~/components/ui/tooltip";
import { SidebarProvider } from "~/components/ui/sidebar";
export const metadata: Metadata = {
  title: "fixa",
  description: "fix AI voice agents faster.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
      <CSPostHogProvider>
        <SidebarProvider>
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
                  <ChildrenWrapper>
                    {children}
                    <Toaster />
                  </ChildrenWrapper>
                </TooltipProvider>
              </TRPCReactProvider>
              {/* </ThemeProvider> */}
            </body>
          </ClerkProvider>
        </SidebarProvider>
      </CSPostHogProvider>
    </html>
  );
}
