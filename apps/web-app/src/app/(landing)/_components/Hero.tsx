import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <div className="relative bg-white pb-16 pt-48">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold lowercase tracking-tight text-black sm:text-5xl md:text-6xl">
            <span className="block">fix your AI voice agents</span>
            <span className="block text-gray-600">faster</span>
          </h1>
          <p className="mx-auto mt-3 text-base lowercase text-gray-500 sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl">
            run tests, analyze calls, fix bugs in your voice agents
          </p>
          <div className="mt-5 flex items-center justify-center gap-2 sm:mt-8">
            <Button
              className="flex items-center justify-center lowercase"
              size="lg"
            >
              get started
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="flex items-center justify-center lowercase"
            >
              view demo
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="relative">
            {/* <div className="absolute inset-0 z-10 bg-gradient-to-t from-white via-transparent to-transparent"></div> */}
            <img
              className="hidden w-full rounded-lg border border-border shadow-2xl md:block"
              src="/images/landing-page/hero.png"
              alt="fixa dashboard interface"
            />
            <img
              className="block w-full rounded-lg border border-border shadow-2xl md:hidden"
              src="/images/landing-page/analyze.png"
              alt="fixa dashboard interface"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
