"use client";

import { useCallback, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogFooter } from "~/components/ui/dialog";
import {
  type BrochureSchema,
  type PropertyWithBrochures,
} from "~/lib/property";
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
import { cn } from "~/lib/utils";

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

  const [confirmDiscard, setConfirmDiscard] = useState<boolean>(false);
  const [editedBrochure, setEditedBrochure] = useState<BrochureSchema | null>(
    null,
  );
  const unsavedChanges = useMemo(() => {
    return editedBrochure !== null;
  }, [editedBrochure]);

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

  const handleEdit = useCallback((brochure: BrochureSchema) => {
    setEditedBrochure(brochure);
  }, []);

  const handleDiscard = useCallback(() => {
    setEditedBrochure(null);
    setConfirmDiscard(false);
    onOpenChange(false);
  }, [onOpenChange]);

  const handleSave = useCallback(() => {
    console.log("save!");
  }, []);

  if (!brochure) return null;
  return (
    <>
      <Dialog open={open} onOpenChange={_onOpenChange}>
        <DialogContent
          className="w-full max-w-[1160px]"
          // className="max-h-[80vh] overflow-y-auto"
          // onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <BrochureCarousel brochure={brochure} onEdit={handleEdit} />
          <DialogFooter
            className={cn(
              unsavedChanges ? "opacity-100" : "opacity-0",
              "flex justify-end gap-2",
            )}
          >
            <Button variant="outline" onClick={() => setConfirmDiscard(true)}>
              Discard
            </Button>
            <Button onClick={handleSave}>Save changes</Button>
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
            <AlertDialogAction onClick={handleDiscard}>
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
