"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { SignUpDialog } from "@/components/SignUpDialog";
import AnimatedPlaceholder from "@/components/AnimatedPlaceholder";

const SplashPage = () => {
  const [text, setText] = useState("");
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const placeholders = [
    "visualize matrix multiplication step-by-step with 2x2 matrices",
    "illustrate the Doppler effect with sound waves",
    "demonstrate the water cycle, from evaporation to precipitation",
    "show the formation and lifecycle of a star in space",
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 p-4 text-white">
      <div className="-mt-3 flex w-1/2 flex-col items-center justify-center gap-6">
        <h1 className="font-md mb-8 text-5xl">bring any concept to life.</h1>
        <div className="flex w-full flex-row gap-2">
          <div className="relative flex-grow">
            {showPlaceholder && text.length === 0 && (
              <AnimatedPlaceholder placeholders={placeholders} />
            )}
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              type="text"
              className="w-full rounded-lg border-none bg-neutral-800 px-6 py-7 text-xl text-white"
              onFocus={() => setShowPlaceholder(false)}
              onBlur={() => setShowPlaceholder(true)}
            />
            <SignUpDialog />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
