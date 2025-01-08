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
        "dark fixed bottom-4 left-1/2 flex w-fit -translate-x-1/2 items-center gap-2 rounded-full bg-background px-3 py-3 text-foreground shadow-sm transition-opacity duration-500",
        isVisible ? "opacity-100" : "opacity-0",
        "rounded-full",
        // "rounded-md",
      )}
    >
      <div className="ml-2 mr-6">
        <div className="mb-1 text-sm font-medium">we&apos;re open source!</div>
        <div className="text-xs">please help increase our star count 🥲</div>
      </div>
      <GitHubButton
        href="https://github.com/fixadev/fixa"
        data-color-scheme="no-preference: light; light: light; dark: light;"
        data-size="large"
        data-show-count="true"
        aria-label="star fixa on GitHub"
      >
        Star
      </GitHubButton>
      <Button
        variant="ghost"
        className="size-6"
        size="icon"
        onClick={() => setIsVisible(false)}
      >
        <XMarkIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
