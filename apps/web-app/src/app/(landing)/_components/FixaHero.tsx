"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { YCBadge } from "./YCBadge";
import { RocketLaunchIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export function FixaHero() {
  return (
    <div className="relative bg-white pb-16 pt-36 sm:pt-48">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-4 flex items-baseline justify-center gap-2">
            <YCBadge />
          </div>
          <h1 className="text-3xl font-extrabold lowercase tracking-tight text-black sm:text-5xl md:text-6xl">
            <span className="block">fix your voice agents</span>
            <span className="block text-gray-600">faster</span>
          </h1>
          <p className="mx-auto mt-3 max-w-96 text-sm text-gray-500 sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl">
            the only python package you need for{" "}
            <br className="hidden sm:block" />
            testing and evaluating AI voice agents.
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:mt-8 sm:flex-row">
            <Button size="lg" className="h-10 w-40" asChild>
              <Link
                href="/sign-up"
                className="flex items-center justify-center lowercase"
              >
                get started
                <RocketLaunchIcon className="ml-2 size-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-10 w-40" asChild>
              <Link
                href="/demo"
                className="flex items-center justify-center lowercase"
              >
                interactive demo
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
