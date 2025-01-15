import React from "react";
import { Button } from "@/components/ui/button";
import { YCBadge } from "./YCBadge";
import { RocketLaunchIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export function Hero() {
  return (
    <div className="relative bg-white pb-16 pt-32 sm:pt-48">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-4">
            <YCBadge />
          </div>
          <h1 className="text-3xl font-extrabold lowercase tracking-tight text-black sm:text-5xl md:text-6xl">
            <span className="block">fix your voice agents</span>
            <span className="block text-gray-600">faster</span>
          </h1>
          <p className="mx-auto mt-3 max-w-96 text-sm text-gray-500 sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl">
            monitor latency, interruptions, and correctness of your calls{" "}
            <br className="hidden sm:block" /> to debug and improve your voice
            agent.
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
            {/* <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  variant="ghost"
                  className="flex w-fit items-center gap-2"
                >
                  <PlayCircleIcon className="size-5" /> watch video
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-screen-lg rounded-none border-none bg-transparent p-0">
                <div className="aspect-video w-full">
                  <iframe
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
            </Dialog> */}
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="relative">
            {/* <div className="absolute inset-0 z-10 bg-gradient-to-t from-white via-transparent to-transparent"></div> */}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="hidden w-full rounded-lg border border-border shadow-2xl md:block"
              src="/images/landing-page/hero.png"
              alt="fixa dashboard interface"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="block w-full rounded-lg border border-border shadow-2xl md:hidden"
              src="/images/landing-page/hero.png"
              alt="fixa dashboard interface"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
