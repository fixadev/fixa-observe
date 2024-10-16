"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Spinner from "~/components/Spinner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/hooks/use-toast";

export default function RequestAccessDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [referral, setReferral] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isFormComplete = useMemo(() => {
    return email.length > 0 && referral.length > 0;
  }, [email, referral]);

  useEffect(() => {
    if (open) {
      setEmail("");
      setReferral("");
    }
  }, [open]);

  const handleSubmit = useCallback(() => {
    setIsLoading(true);
    void fetch(
      "https://script.google.com/macros/s/AKfycbwAtuQGpgS-NshUAUph0XKE-Ezv5QwNidu0bwRJL9ZKOyTXpGMcYkTMF6owtZrFi5C7/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email,
          referral,
        }).toString(),
      },
    )
      .then(() => {
        toast({
          title: "Request sent",
          description: "We'll review your request and get back to you soon.",
        });
        onOpenChange(false);
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Error submitting request",
          description: "Please try again later.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [email, referral, onOpenChange, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request access to Apex</DialogTitle>
          <DialogDescription>
            We&apos;ll send you an email when we&apos;ve approved your request.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="referral">How did you hear about us?</Label>
            <Input
              id="referral"
              placeholder="LinkedIn, Twitter, a friend, etc."
              value={referral}
              onChange={(e) => setReferral(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={isLoading || !isFormComplete}
            onClick={handleSubmit}
          >
            {isLoading ? <Spinner /> : "Request access"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
