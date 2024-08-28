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
  const [email, setEmail] = useState("");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <ArrowRightCircleIcon className="absolute right-2 top-1/2 size-10 -translate-y-1/2 text-gray-400 hover:cursor-pointer hover:text-gray-500" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join the waitlist</DialogTitle>
          <DialogDescription>
            If we spam you you can come to our house and kill us.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="items-center gap-4">
            <Input
              id="username"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
