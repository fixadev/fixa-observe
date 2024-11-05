"use client";

import { Button } from "~/components/ui/button";
import Link from "next/link";
import Image from "next/image";

// 420 69 🍆
export default function LandingPage() {
  return (
    <div className="container relative mx-auto flex h-screen items-center">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-8">
          <div className="-ml-1 text-7xl font-medium md:-ml-2 md:text-8xl lg:text-9xl">
            pixa.
          </div>
          <div className="text-2xl text-muted-foreground/60 sm:text-3xl md:text-4xl lg:text-5xl">
            the observability platform for voice AI.
          </div>
        </div>
        <Button size="lg" asChild className="w-fit">
          <Link
            href="https://cal.com/team/pixa/20-minute-meeting"
            target="_blank"
          >
            book demo
          </Link>
        </Button>
      </div>
      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2 sm:gap-4">
        <div className="text-muted-foreground">backed by</div>
        <Image
          src="/images/yc.png"
          alt="y-combinator"
          width={200}
          height={200 * (399 / 1400)}
          className="w-[150px] sm:w-[200px]"
        />
      </div>
    </div>
  );
}
