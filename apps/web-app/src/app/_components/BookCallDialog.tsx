import { useUser } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

export default function BookCallDialog({
  title = "you've run out of free generations!",
  open,
  onOpenChange,
}: {
  title?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { user } = useUser();
  const [state, setState] = useState<"initial" | "loading" | "success">(
    "initial",
  );
  const [usageDescription, setUsageDescription] = useState<string>("");

  const [email, setEmail] = useState<string>("");
  useEffect(() => {
    setEmail(user?.primaryEmailAddress?.emailAddress ?? "");
  }, [user]);

  const handleSubmit = () => {
    setState("loading");
    fetch(
      "https://script.google.com/macros/s/AKfycbxJKx193ozKu98xA5u3geVwe5ewFzSDRPBYTpV3iHCSHILv3s2yJ_Gz1dcoZ9B1l-xe/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email,
          usageDescription,
        }).toString(),
      },
    )
      .then(() => {
        setState("success");
      })
      .catch(() => {
        setState("initial");
      });
  };

  const isFormValid = useMemo(() => {
    return email && usageDescription;
  }, [email, usageDescription]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {state !== "success" && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            thank you for your interest in pixa! we&apos;re currently
            experiencing high demand. tell us a bit about what you plan on using
            pixa for and we&apos;ll get back to you within 24 hours.
          </DialogDescription>
          <Input
            type="email"
            placeholder="enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Textarea
            placeholder="i plan on using pixa to..."
            value={usageDescription}
            onChange={(e) => setUsageDescription(e.target.value)}
          />
          <DialogFooter>
            <Button
              disabled={state === "loading" || !isFormValid}
              type="submit"
              onClick={handleSubmit}
            >
              {state === "loading" ? "requesting access..." : "request access"}
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
      {state === "success" && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>request submitted!</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            we&apos;ll reach out via email within 24 hours. if we don&apos;t,
            feel free to spam us at{" "}
            <a className="underline" href="mailto:contact@pixa.dev">
              contact@pixa.dev
            </a>
            .
          </DialogDescription>
        </DialogContent>
      )}
    </Dialog>
  );
}
