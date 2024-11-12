"use client";

import { Button } from "~/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import ImportAgentFlow from "~/app/_components/ImportAgentFlow";

// 420 69 🍆
export default function LandingPage() {
  return (
    <>
      <div className="container relative mx-auto flex h-screen items-center">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-8">
            <div className="-ml-1 text-7xl font-medium md:-ml-2 md:text-8xl lg:text-9xl">
              pixa.
            </div>
            <div className="text-2xl text-muted-foreground/60 sm:text-3xl md:text-4xl lg:text-5xl">
              testing for AI voice agents :)
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="lg" asChild className="w-fit">
              <Link
                href="https://cal.com/team/pixa/20-minute-meeting"
                target="_blank"
              >
                book demo
              </Link>
            </Button>
            <Button size="lg" variant="ghost" asChild className="w-fit">
              <Link href="#how-it-works">how it works</Link>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2">
          <Image
            src="/images/yc.png"
            alt="y-combinator"
            width={200}
            height={200 * (399 / 1400)}
            className="w-[150px] sm:w-[200px]"
          />
          <div className="text-muted-foreground">
            <span className="mr-1">gave us money</span> <span>🤑</span>
          </div>
        </div>
      </div>
      <div className="bg-muted py-16">
        <div
          className="container mx-auto flex flex-col items-center gap-12"
          id="how-it-works"
        >
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-4">
              <div className="text-2xl font-medium">1. import agent 🕵️‍♀️</div>
              <div className="text-muted-foreground">
                give us your system prompt and we will generate test cases for
                you !
              </div>
            </div>
            <ImportAgentFlow />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative h-[300px] w-[400px]">
              <Image
                src="/images/agent-avatars/steve.jpeg"
                alt="Test agent 1"
                width={200}
                height={200}
                className="absolute bottom-0 left-0 h-[150px] w-[150px] rounded-full object-cover"
              />
              <Image
                src="/images/agent-avatars/lily.jpeg"
                alt="Test agent 2"
                width={200}
                height={200}
                className="absolute left-1/2 top-0 h-[200px] w-[200px] -translate-x-1/2 rounded-full object-cover"
              />
              <Image
                src="/images/agent-avatars/marge.jpeg"
                alt="Test agent 3"
                width={200}
                height={200}
                className="absolute bottom-0 right-0 h-[150px] w-[150px] rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-2xl font-medium">2. run tests 🚀</div>
              <div className="text-muted-foreground">
                our super hot super sexy test agents will call your agents to
                test them out.
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-2xl font-medium">3. analyze calls 🧐</div>
            <div className="text-muted-foreground">
              pinpoint exactly where errors occur in the audio.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
