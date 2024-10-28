"use client";

import { useSurvey } from "~/hooks/useSurvey";
import BrochureDialog from "../_components/brochures/BrochureDialog";
import { useState } from "react";
import { Button } from "~/components/ui/button";

export default function TestPage() {
  const { survey } = useSurvey();
  const [open, setOpen] = useState<boolean>(true);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <BrochureDialog
        property={survey?.properties[0]}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}
