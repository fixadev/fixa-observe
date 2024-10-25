"use client";

import { useSurvey } from "~/hooks/useSurvey";
import BrochureDialog from "../_components/brochures/BrochureDialog";

export default function TestPage() {
  const { survey } = useSurvey();
  return (
    <div>
      <div> hello </div>
      <BrochureDialog
        property={survey?.properties[0]}
        open={true}
        onOpenChange={() => {
          return false;
        }}
      />
    </div>
  );
}
