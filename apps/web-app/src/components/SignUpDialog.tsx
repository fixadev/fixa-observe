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

export function SignUpDialog() {
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
      "https://script.google.com/a/macros/play.ht/s/AKfycbz-zwahB1de3PGAo2burNFDBMyqjTew_VBZeBITm0gfC9TPSgbn_3G-X_oNNlmikjS-/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ email }).toString(),
      },
    ).then(() => {
      setStage("success");
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ArrowRightCircleIcon className="absolute right-2 top-1/2 size-10 -translate-y-1/2 text-neutral-400 hover:cursor-pointer hover:text-neutral-200" />
      </DialogTrigger>
      <DialogContent className="min-h-[250px] bg-neutral-900 sm:max-w-[425px]">
        {stage === "initial" || stage === "loading" ? (
          <>
            <DialogHeader>
              <DialogTitle>join the waitlist</DialogTitle>
              <DialogDescription>
                we haven't launched yet lol.
              </DialogDescription>
            </DialogHeader>
            <Input
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
              className="w-full"
            />
            <DialogFooter>
              <Button type="submit" onClick={() => handleSubmit()}>
                {stage === "loading" ? "Loading..." : "Submit"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Thank you!</DialogTitle>
              <DialogDescription>
                We'll email you when we launch.
              </DialogDescription>
            </DialogHeader>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
