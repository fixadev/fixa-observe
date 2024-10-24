import { useMemo } from "react";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { type PropertyWithBrochures } from "~/lib/property";
import { BrochureCarousel } from "./BrochureCarousel";

export default function BrochureDialog({
  property,
  open,
  onOpenChange,
}: {
  property: PropertyWithBrochures;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const brochure = useMemo(() => property.brochures[0], [property.brochures]);

  if (!brochure) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
      // className="max-h-[80vh] overflow-y-auto"
      // onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <BrochureCarousel
          brochure={brochure}
          isGeneratingPDF={false}
          onEdit={() => null}
        />
      </DialogContent>
    </Dialog>
  );
}
