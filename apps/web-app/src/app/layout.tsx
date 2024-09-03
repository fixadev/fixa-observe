import "~/styles/globals.css";

import { ThemeProvider } from "@/components/ThemeProvider";
import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import { ibmPlexSans } from "./fonts";
import { CSPostHogProvider } from "./providers";

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
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </ThemeProvider>
        </body>
      </CSPostHogProvider>
    </html>
  );
}
