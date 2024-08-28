"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignUpDialog } from "../app/_components/dialogue";
import AnimatedPlaceholder from "./AnimatedPlaceholder";

const ConceptInputPage = () => {
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const placeholders = [
    "Visualize matrix multiplication step-by-step with 2x2 matrices",
    "Illustrate the Doppler effect with sound waves",
    "Demonstrate the water cycle, from evaporation to precipitation",
    "Show the formation and lifecycle of a star in space",
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4 text-white">
      <div className="-mt-3 flex w-1/2 flex-col items-center justify-center gap-6">
        <h1 className="font-md mb-8 text-5xl">Bring any concept to life</h1>
        <div className="flex w-full flex-row gap-2">
          <div className="relative flex-grow">
            {showPlaceholder && (
              <AnimatedPlaceholder placeholders={placeholders} />
            )}
            <Input
              type="text"
              className="w-full rounded-lg border-none bg-gray-800 px-6 py-7 text-xl text-white"
              onFocus={() => setShowPlaceholder(false)}
              onBlur={() => setShowPlaceholder(true)}
            />
          </div>
          <SignUpDialog />
        </div>
      </div>
    </div>
  );
};

export default ConceptInputPage;
