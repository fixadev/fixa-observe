import { Button } from "~/components/ui/button";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export default function UnsavedChangesBar({
  save,
  discard,
}: {
  save: () => void;
  discard: () => void;
}) {
  return (
    <div className="fixed bottom-4 left-1/2 flex w-fit animate-slide-up items-center gap-10 rounded-md border border-border bg-background p-2 shadow-sm">
      <div className="flex items-center gap-2">
        <InformationCircleIcon className="size-5 text-muted-foreground" />
        <div className="text-sm font-medium">unsaved changes</div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={discard}>
          discard
        </Button>
        <Button onClick={save}>save</Button>
      </div>
    </div>
  );
}
