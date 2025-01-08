import React from "react";
import { Navbar } from "./_components/Navbar";
import { Hero } from "./_components/Hero";
import { LogoCloud } from "./_components/logos/LogoCloud";
import { Features } from "./_components/Features";
import { Pricing } from "./_components/Pricing";
import { Footer } from "./_components/Footer";
import { CTA } from "./_components/CTA";
import { type Metadata } from "next";
import { OpenSourceToast } from "./_components/OpenSourceToast";

export const metadata: Metadata = {
  title: "fixa | AI voice agent testing and observability",
  description: "run tests, analyze calls, fix bugs in your voice agents",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "fixa | AI voice agent testing and observability",
    description: "run tests, analyze calls, fix bugs in your voice agents",
    images: [
      {
        url: "/images/landing-page/og-image.png",
      },
    ],
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <LogoCloud />
      <Features />
      <Pricing />
      <CTA />
      <Footer />
      <OpenSourceToast />
    </div>
  );
}
