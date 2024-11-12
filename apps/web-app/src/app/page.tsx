"use client";

import { Button } from "~/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import ImportAgentFlow from "~/app/_components/ImportAgentFlow";
import { useCallback } from "react";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";

// 420 69 🍆
export default function LandingPage() {
  const scrollToHowItWorks = useCallback(() => {
    const howItWorksSection = document.getElementById("how-it-works");
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <>
      <div className="container relative mx-auto flex flex-col items-center justify-center gap-8 pb-24 pt-16 md:h-screen md:flex-row md:pb-16">
        <div className="flex w-full flex-col items-center gap-6 md:w-[unset] md:items-start md:gap-12">
          <div className="flex flex-col items-center gap-4 md:items-start md:gap-8">
            <div className="-ml-1 text-4xl font-medium md:-ml-1 md:text-6xl lg:text-7xl">
              pixa.
            </div>
            <div className="text-xl text-muted-foreground/60 sm:text-2xl md:text-2xl lg:text-3xl">
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
            <Button
              size="lg"
              variant="ghost"
              className="w-fit"
              onClick={scrollToHowItWorks}
            >
              how it works
            </Button>
          </div>
        </div>
        <div className="shrink-1 flex w-full items-center justify-center md:flex-1">
          <div className="relative aspect-square w-full max-w-[400px] overflow-hidden rounded-md border border-border bg-background object-contain p-2 shadow-sm md:aspect-[1716/1090] md:max-w-none">
            <Image
              src="/images/landing-page/hero.png"
              alt="hero image"
              // width={800}
              // height={800 * (1090 / 1716)}
              fill
              sizes="80vw"
              className="hidden md:block"
            />
            <Image
              src="/images/landing-page/analyze.png"
              alt="hero image"
              // width={800}
              // height={800 * (1090 / 1716)}
              fill
              sizes="80vw"
              className="block md:hidden"
            />
          </div>
        </div>
        <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-2 md:bottom-6">
          <Image
            src="/images/landing-page/yc.png"
            alt="y-combinator"
            width={200}
            height={200 * (399 / 1400)}
            className="w-[150px] md:w-[200px]"
          />
          <div className="text-muted-foreground">
            <span className="mr-1">gave us money</span> <span>🤑</span>
          </div>
        </div>
      </div>
      <div id="how-it-works" />
      <div className="bg-muted py-16">
        <div className="container mx-auto flex flex-col items-center gap-16">
          <div className="text-2xl font-medium">how it works.</div>
          <div className="flex flex-col items-center gap-8 lg:flex-row">
            <div className="flex max-w-[400px] flex-col gap-4 lg:w-[400px] lg:max-w-none">
              <div className="text-2xl font-medium">1. import agent 🕵️‍♀️</div>
              <div className="text-muted-foreground">
                give us your system prompt and we will generate test cases for
                you !
              </div>
            </div>
            <div className="shrink-1 max-w-[400px] lg:h-[207px] lg:w-[600px] lg:max-w-none">
              <Image
                src="/images/landing-page/import-agent-flow.png"
                alt="import agent flow"
                width={600 * 2}
                height={600 * 2 * (610 / 1764)}
              />
            </div>
          </div>
          <div className="flex flex-col-reverse items-center gap-8 lg:flex-row">
            <div className="relative h-[300px] w-full max-w-[400px] lg:w-[400px] lg:max-w-none">
              <Image
                src="/images/agent-avatars/steve.jpeg"
                alt="Test agent 1"
                width={200}
                height={200}
                className="absolute bottom-0 left-4 h-[150px] w-[150px] rounded-full object-cover"
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
                className="absolute bottom-0 right-4 h-[150px] w-[150px] rounded-full object-cover"
              />
            </div>
            <div className="flex max-w-[400px] flex-col gap-4 lg:w-[400px] lg:max-w-none">
              <div className="text-2xl font-medium">2. run tests 🚀</div>
              <div className="text-muted-foreground">
                our test agents will call your agents to test them out.
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-8 lg:flex-row">
            <div className="flex max-w-[400px] flex-col gap-4 lg:w-[400px] lg:max-w-none">
              <div className="text-2xl font-medium">3. analyze calls 🧐</div>
              <div className="text-muted-foreground">
                pinpoint exactly where errors occur in the audio.
              </div>
            </div>
            <div className="rounded-md border border-border bg-background p-2 shadow-sm">
              <Image
                src="/images/landing-page/analyze.png"
                alt="analyze"
                width={400}
                height={400}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="dark bg-background py-16 text-foreground">
        <div className="container mx-auto flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-center gap-4 sm:items-start">
            <div className="text-2xl font-medium">pixa.</div>
            <div className="text-center text-lg sm:text-left">
              testing for AI voice agents :)
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Button size="lg" asChild className="w-fit">
              <Link
                href="https://cal.com/team/pixa/20-minute-meeting"
                target="_blank"
              >
                book demo
              </Link>
            </Button>
            {/* <Button onClick={() => setRequestAccessDialogOpen(true)}>
              Request access
            </Button> */}
            <div className="flex gap-2">
              <Button variant="ghost" asChild>
                <Link href="mailto:contact@pixa.dev" target="_blank">
                  contact
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link
                  href="https://www.linkedin.com/company/pixa-dev"
                  target="_blank"
                >
                  <LinkedInLogoIcon className="size-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
