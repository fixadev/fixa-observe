import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";

export default function BookCallDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>you've run out of free generations!</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          tell us what you plan on using pixa for and we'll get back to you
          within 24 hours.
        </DialogDescription>
        <Textarea placeholder="i plan on using pixa to..." />
        <DialogFooter>
          <Button>request access</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
