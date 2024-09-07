import "~/styles/globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
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
import ChildrenWrapper from "./_components/ChildrenWrapper";

export const metadata: Metadata = {
  title: "pixa.dev",
  description: "the real-time AI text to video api",
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
      className={`${ibmPlexSans.className} dark`}
      style={{ colorScheme: "dark" }}
    >
      <CSPostHogProvider>
        <ClerkProvider
          appearance={{ baseTheme: dark }}
          localization={localization}
        >
          <body>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <TRPCReactProvider>
                <ChildrenWrapper>
                  <div className="fixed left-0 top-0 flex h-16 w-full items-center justify-between bg-neutral-900 p-4">
                    <Logo />
                    <SignedIn>
                      <UserButton />
                    </SignedIn>
                    <SignedOut>
                      <SignInButton
                        mode="modal"
                        forceRedirectUrl="/"
                        signUpForceRedirectUrl="/"
                      />
                    </SignedOut>
                  </div>

                  <div className="mt-16">{children}</div>
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
