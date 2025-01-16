"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import GitHubButton from "react-github-btn";
import { Button } from "~/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "~/lib/utils";

export function OpenSourceToast() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "dark fixed bottom-2 left-1/2 flex w-[calc(100%-1rem)] -translate-x-1/2 flex-row items-center justify-center gap-2 bg-gray-800 px-3 py-3 text-foreground shadow-sm transition-opacity duration-500 sm:bottom-4 sm:w-fit sm:justify-between",
        isVisible ? "opacity-100" : "opacity-0",
        "rounded-md sm:rounded-full",
        // "rounded-md",
      )}
    >
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-8">
        <div className="sm:ml-2">
          <div className="mb-1 text-center text-sm font-medium sm:text-left">
            we&apos;re open source!
          </div>
          <div className="whitespace-nowrap text-center text-xs sm:text-left">
            please help increase our star count 🥲
          </div>
        </div>
        <div>
          <GitHubButton
            href="https://github.com/fixadev/fixa-observe"
            data-color-scheme="no-preference: light; light: light; dark: light;"
            data-size="large"
            data-show-count="true"
            aria-label="star fixa on GitHub"
          >
            Star
          </GitHubButton>
        </div>
      </div>
      <Button
        variant="ghost"
        className="hidden size-6 sm:block"
        size="icon"
        onClick={() => setIsVisible(false)}
      >
        <XMarkIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        className="absolute bottom-0 right-2 top-2 size-6 sm:hidden"
        size="icon"
        onClick={() => setIsVisible(false)}
      >
        <XMarkIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
