"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { SignUpDialog } from "./SignUpDialog";
import { useTheme } from "next-themes";

export const SplashPage = () => {
  const { setTheme } = useTheme();
  setTheme("dark");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 p-4 text-white">
      <div className="-mt-3 flex w-1/2 flex-col items-center justify-center gap-6">
        <h1 className="font-md mb-8 text-5xl">Bring any concept to life</h1>
        <div className="relative flex w-full flex-row gap-2">
          <Input
            type="text"
            placeholder="Explain how matrices work"
            className="w-full rounded-lg border-none bg-neutral-800 px-6 py-7 text-xl text-white"
          />
          <SignUpDialog />
        </div>
      </div>
    </div>
  );
};
