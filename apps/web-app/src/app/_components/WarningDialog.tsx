"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import Spinner from "~/components/Spinner";

interface WarningDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  isPending?: boolean;
  children: React.ReactNode;
}

export function WarningDialog({
  title,
  message,
  onConfirm,
  isPending,
  children,
}: WarningDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            className="text-red-500 hover:text-red-500"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? <Spinner /> : "confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
