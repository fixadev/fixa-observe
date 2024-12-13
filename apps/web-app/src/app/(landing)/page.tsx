import React from "react";
import { Navbar } from "./_components/Navbar";
import { Hero } from "./_components/Hero";
import { LogoCloud } from "./_components/logos/LogoCloud";
import { Features } from "./_components/Features";
import { Pricing } from "./_components/Pricing";
import { CTA } from "./_components/CTA";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <LogoCloud />
      <Features />
      <Pricing />
      <CTA />
    </div>
  );
}

export default App;
