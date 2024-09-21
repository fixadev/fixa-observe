import "~/styles/globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import { ibmPlexSans } from "./fonts";
import { CSPostHogProvider } from "./providers";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import ChildrenWrapper from "./_components/ChildrenWrapper";
import NavWrapper from "./_components/NavWrapper";

export const metadata: Metadata = {
  title: "pixa.dev",
  description: "voice agent observability, monitoring, and analytics",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const localization = {
  signIn: {
    start: {
      title: "please sign in to continue using pixa",
      subtitle: "an account is required to prevent abuse",
    },
  },
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
          appearance={{ baseTheme: dark }}
          localization={localization}
        >
          <body>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <TRPCReactProvider>
                <ChildrenWrapper>
                  <NavWrapper>{children}</NavWrapper>
                  <Toaster />
                </ChildrenWrapper>
              </TRPCReactProvider>
            </ThemeProvider>
          </body>
        </ClerkProvider>
      </CSPostHogProvider>
    </html>
  );
}
