import { useCallback, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogFooter } from "~/components/ui/dialog";
import { type PropertyWithBrochures } from "~/lib/property";
import { BrochureCarousel } from "./BrochureCarousel";
import { Button } from "~/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "~/components/ui/alert-dialog";

export default function BrochureDialog({
  property,
  open,
  onOpenChange,
}: {
  property?: PropertyWithBrochures;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const brochure = useMemo(() => property?.brochures[0], [property?.brochures]);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [confirmDiscard, setConfirmDiscard] = useState<boolean>(false);

  const _onOpenChange = useCallback(
    (open: boolean) => {
      if (unsavedChanges && !open) {
        setConfirmDiscard(true);
        return;
      }
      onOpenChange(open);
    },
    [onOpenChange, unsavedChanges],
  );

  const onDiscard = useCallback(() => {
    setUnsavedChanges(false);
    setConfirmDiscard(false);
    onOpenChange(false);
  }, [onOpenChange]);

  if (!brochure) return null;
  return (
    <>
      <Dialog open={open} onOpenChange={_onOpenChange}>
        <DialogContent
          className="w-full max-w-[1160px]"
          // className="max-h-[80vh] overflow-y-auto"
          // onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <BrochureCarousel
            brochure={brochure}
            isGeneratingPDF={false}
            onEdit={() => null}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDiscard(true)}>
              Discard
            </Button>
            <Button>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={confirmDiscard} onOpenChange={setConfirmDiscard}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to discard your changes?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDiscard}>Discard</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
