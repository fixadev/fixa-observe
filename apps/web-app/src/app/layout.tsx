import "~/styles/globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import { ibmPlexSans } from "./fonts";
import { CSPostHogProvider } from "./providers";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "pixa.dev",
  description: "the real-time AI text to video api",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${ibmPlexSans.className}`}>
      <CSPostHogProvider>
        <ClerkProvider appearance={{ baseTheme: dark }}>
          <body>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <TRPCReactProvider>
                <div className="absolute left-0 top-0 flex w-full items-center justify-between bg-neutral-900 p-4">
                  <Logo />
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                  <SignedOut>
                    <SignInButton mode="modal" />
                  </SignedOut>
                </div>

                {children}
              </TRPCReactProvider>
            </ThemeProvider>
          </body>
        </ClerkProvider>
      </CSPostHogProvider>
    </html>
  );
}
