import { IBM_Plex_Mono } from "next/font/google";
import { IBM_Plex_Sans } from "next/font/google";

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  // variable: "--font-ibm-plex-mono",
});

export const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  // variable: "--font-ibm-plex-sans",
});
