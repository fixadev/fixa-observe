"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ArrowRightCircleIcon } from "@heroicons/react/24/solid";
import { Label } from "./ui/label";

export function SignUpDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [email, setEmail] = useState<string>("");
  const [stage, setStage] = useState<"initial" | "loading" | "success">(
    "initial",
  );
  const [error, setError] = useState<boolean>(false);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    if (stage === "loading") return;
    if (!isValidEmail(email)) {
      setError(true);
      return;
    }
    setStage("loading");
    fetch(
      "https://script.google.com/macros/s/AKfycbxo9lGOTe-9-H0qKqufYQYYWVHOCb9Ci0kQnhJTB2msGpki1SW1nXq8MAhnROD8iMAU/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ email }).toString(),
      },
    )
      .then(() => {
        setStage("success");
      })
      .catch(() => {
        setStage("initial");
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <ArrowRightCircleIcon className="absolute right-2 top-1/2 size-10 -translate-y-1/2 text-neutral-400 hover:cursor-pointer hover:text-neutral-200" />
      </DialogTrigger>
      <DialogContent className="min-h-[250px] bg-neutral-900 sm:max-w-[425px]">
        {stage === "initial" || stage === "loading" ? (
          <>
            <DialogHeader>
              <DialogTitle>join the waitlist</DialogTitle>
              {/* <DialogDescription>
                we haven't launched yet lol.
              </DialogDescription> */}
            </DialogHeader>

            <div className="flex flex-col items-center">
              <img src="/cat_typing.gif" className="w-4/5" />
              <div className="mt-1 text-center text-sm text-neutral-400">
                real-time footage of us trying to launch this
              </div>
            </div>

            <Label htmlFor="email">enter your email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="dalton@ycombinator.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              className="w-full placeholder:text-neutral-600"
            />
            <DialogFooter>
              <Button
                disabled={!isValidEmail(email) || stage === "loading"}
                type="submit"
                onClick={() => handleSubmit()}
              >
                {stage === "loading" ? "submitting..." : "submit"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>done.</DialogTitle>
              <DialogDescription>
                thank you for trusting us with your email. we&apos;ll take good
                care of it. mwahahahahaha {">:)"}
              </DialogDescription>
            </DialogHeader>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
