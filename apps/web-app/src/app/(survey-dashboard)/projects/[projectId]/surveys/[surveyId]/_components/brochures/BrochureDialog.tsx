"use client";

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
import { cn, getBrochureFileName } from "~/lib/utils";
import { BrochurePDFRenderer } from "./BrochurePDFRenderer";
import Spinner from "~/components/Spinner";
import { api } from "~/trpc/react";
import axios from "axios";
import { type Brochure } from "prisma/generated/zod";

export default function BrochureDialog({
  property,
  open,
  onOpenChange,
  onSave,
}: {
  property?: PropertyWithBrochures;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (brochure: Brochure) => void;
}) {
  const brochure = useMemo(() => property?.brochures[0], [property?.brochures]);

  const [confirmDiscard, setConfirmDiscard] = useState<boolean>(false);
  const [editedBrochure, setEditedBrochure] = useState<Brochure | null>(null);
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

  const handleEdit = useCallback((brochure: Brochure) => {
    console.log("Edited brochure...!", brochure);
    setEditedBrochure(brochure);
  }, []);

  const handleDiscard = useCallback(() => {
    setEditedBrochure(null);
    setConfirmDiscard(false);
    onOpenChange(false);
  }, [onOpenChange]);

  const { mutate: updateBrochure } = api.brochure.update.useMutation();
  const { mutateAsync: updateExportedUrl } =
    api.brochure.updateExportedUrl.useMutation();
  const { mutateAsync: getPresignedS3Url } =
    api.s3.getPresignedS3Url.useMutation();

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const handleSave = useCallback(() => {
    if (!editedBrochure) return;
    setIsSaving(true);
    updateBrochure(editedBrochure);
  }, [editedBrochure, updateBrochure]);

  const handlePDFGenerated = useCallback(
    async (pdfBlob: Blob) => {
      if (!property || !editedBrochure) return;

      console.log("PDF generated!!");
      const brochurePresignedUrl = await getPresignedS3Url({
        fileName: getBrochureFileName(property, true),
        fileType: "application/pdf",
        keepOriginalName: true,
      });
      console.log("Uploading PDF to S3...");
      await axios.put(brochurePresignedUrl, pdfBlob, {
        headers: {
          "Content-Type": "application/pdf",
        },
      });
      console.log("PDF uploaded to S3!");

      const brochureUrl =
        brochurePresignedUrl.split("?")[0] ?? brochurePresignedUrl;
      await updateExportedUrl({
        brochureId: editedBrochure.id,
        exportedUrl: brochureUrl,
      });

      onSave({ ...editedBrochure, exportedUrl: brochureUrl });
      onOpenChange(false);
      setIsSaving(false);
      setEditedBrochure(null);
    },
    [
      property,
      editedBrochure,
      getPresignedS3Url,
      updateExportedUrl,
      onOpenChange,
      onSave,
    ],
  );

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
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Spinner /> : "Save changes"}
            </Button>
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
      {isSaving && editedBrochure && (
        <BrochurePDFRenderer
          brochure={editedBrochure}
          onPDFGenerated={handlePDFGenerated}
        />
      )}
    </>
  );
}
