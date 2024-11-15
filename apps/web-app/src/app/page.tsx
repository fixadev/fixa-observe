"use client";

import { Button } from "~/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useCallback, useState } from "react";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import TopBar from "./_components/TopBar";
import { SuggestedChange } from "./_components/SuggestedChange";
import { PlayCircleIcon } from "@heroicons/react/24/solid";
import { Dialog, DialogContent } from "~/components/ui/dialog";

// 420 69 🍆
export default function LandingPage() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const scrollToHowItWorks = useCallback(() => {
    const howItWorksSection = document.getElementById("how-it-works");
    if (howItWorksSection) {
      const yOffset = -70; // Scroll to 100px above the section
      const y =
        howItWorksSection.getBoundingClientRect().top +
        window.scrollY +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  const openVideoModal = useCallback(() => {
    setVideoModalOpen(true);
  }, []);

  return (
    <>
      <TopBar />
      <div className="container relative mx-auto flex flex-col items-center justify-center gap-8 pb-24 pt-32 md:h-screen">
        <div className="flex flex-col items-center gap-8 md:gap-12">
          <div className="flex flex-col items-center gap-4 md:gap-8">
            <div className="text-center text-2xl font-medium md:text-6xl">
              fix AI voice agents faster.
            </div>
            <div className="text-center text-lg text-muted-foreground/60 md:text-3xl">
              run tests, analyze calls, fix bugs.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="lg" asChild className="w-fit">
              <Link
                href="https://cal.com/team/fixa/20-minute-meeting"
                target="_blank"
              >
                book demo
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="flex w-fit items-center gap-2"
              onClick={openVideoModal}
            >
              <PlayCircleIcon className="size-5" /> watch video
            </Button>
          </div>
        </div>
        <div className="shrink-1 flex w-full items-center justify-center">
          <div className="relative aspect-square w-full max-w-[min(500px,70vh)] overflow-hidden rounded-md border border-border bg-background object-contain shadow-sm md:aspect-[1806/1044] md:max-w-[min(900px,80vh)]">
            <Image
              src="/images/landing-page/hero.png"
              alt="hero image"
              fill
              sizes="100vw"
              className="hidden md:block"
              priority
            />
            <Image
              src="/images/landing-page/analyze.png"
              alt="hero image"
              fill
              sizes="100vw"
              className="block md:hidden"
              priority
            />
          </div>
        </div>
        <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center">
          <div className="-mx-2 -my-1 flex items-center gap-2 rounded-md bg-background px-2 py-1">
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
                you.
              </div>
            </div>
            <div className="shrink-1 max-w-[400px] lg:w-[550px] lg:max-w-none">
              <Image
                src="/images/landing-page/import-agent-flow.png"
                alt="import agent flow"
                width={600 * 2}
                height={600 * 2 * (610 / 1764)}
              />
            </div>
          </div>
          <div className="flex flex-col-reverse items-center gap-8 lg:flex-row">
            <div className="flex flex-row items-center">
              <div className="overflow-hidden rounded-md border border-border bg-background py-2 shadow-sm lg:-mr-[190px]">
                <Image
                  src="/images/landing-page/test-agents-small.png"
                  alt="test agents"
                  width={400}
                  height={400}
                />
              </div>
              <div className="relative hidden h-[200px] w-full max-w-[400px] sm:h-[300px] lg:block lg:w-[400px] lg:max-w-none">
                <Image
                  src="/images/agent-avatars/steve.jpeg"
                  alt="Test agent 1"
                  width={200}
                  height={200}
                  className="absolute bottom-0 left-0 h-[120px] w-[120px] rounded-full object-cover sm:left-4 sm:h-[150px] sm:w-[150px]"
                />
                <Image
                  src="/images/agent-avatars/lily.jpeg"
                  alt="Test agent 2"
                  width={200}
                  height={200}
                  className="absolute left-1/2 top-0 h-[150px] w-[150px] -translate-x-1/2 rounded-full object-cover sm:h-[200px] sm:w-[200px]"
                />
                <Image
                  src="/images/agent-avatars/marge.jpeg"
                  alt="Test agent 3"
                  width={200}
                  height={200}
                  className="absolute bottom-0 right-0 h-[120px] w-[120px] rounded-full object-cover sm:right-4 sm:h-[150px] sm:w-[150px]"
                />
              </div>
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
                pinpoint exactly where errors occur in both dev and prod.
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
          <div className="flex flex-col-reverse items-center gap-8 lg:flex-row">
            <SuggestedChange
              removed={["ALWAYS address the user by the user's name"]}
              added={[
                "only address the user by name if they have",
                "provided it to you",
              ]}
            />
            <div className="flex flex-row items-center"></div>
            <div className="flex max-w-[400px] flex-col gap-4 lg:w-[400px] lg:max-w-none">
              <div className="text-2xl font-medium">4. fix bugs 🛠️</div>
              <div className="text-muted-foreground">
                fixa suggests actionable changes to your prompt to reduce
                errors.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="dark bg-background py-16 text-foreground">
        <div className="container mx-auto flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-center gap-4 sm:items-start">
            <div className="text-2xl font-medium">fixa.</div>
            <div className="text-center text-lg sm:text-left">
              fix AI voice agents faster.
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Button size="lg" asChild className="w-fit">
              <Link
                href="https://cal.com/team/fixa/20-minute-meeting"
                target="_blank"
              >
                book demo
              </Link>
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" asChild>
                <Link href="mailto:contact@fixa.dev" target="_blank">
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
      <VideoModal open={videoModalOpen} onOpenChange={setVideoModalOpen} />
    </>
  );
}

function VideoModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-lg rounded-none border-none bg-transparent p-0">
        <div className="aspect-video w-full">
          {/* <iframe
            src="https://www.youtube.com/embed/Cnhf3Vs5Dcw?si=--oSyCyh2NZsVYgN"
            title="YouTube video player"
          /> */}
          <iframe
            // width="974"
            // height="548"
            className="h-full w-full"
            src="https://www.youtube.com/embed/Cnhf3Vs5Dcw?iv_load_policy=3&rel=0&modestbranding=1&playsinline=1&autoplay=1&color=white"
            title="YouTube video player"
            frameBorder="0"
            allow="presentation; fullscreen; accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
}
