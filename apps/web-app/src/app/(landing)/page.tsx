import React from "react";
import { Navbar } from "./_components/Navbar";
import { LogoCloud } from "./_components/logos/LogoCloud";
import { Features } from "./_components/Features";
import { Pricing } from "./_components/Pricing";
import { Footer } from "./_components/Footer";
import { CTA } from "./_components/CTA";
import { OpenSourceToast } from "./_components/OpenSourceToast";
import { FixaHero } from "./_components/FixaHero";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <FixaHero />
      <Footer />
      <OpenSourceToast />
    </div>
  );
}
