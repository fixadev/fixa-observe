import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "~/components/ui/button";

export function UnsavedChangesToast({
  saveChanges,
  discardChanges,
}: {
  saveChanges: () => void;
  discardChanges: () => void;
}) {
  return (
    <div className="fixed bottom-2 left-1/2 flex -translate-x-1/2 flex-row items-center gap-2 rounded-xl border-[2px] border-gray-200 bg-white px-4 py-2">
      <InformationCircleIcon className="size-5 text-gray-500" />
      <p className="mr-6 text-sm text-gray-500">Unsaved changes</p>
      <Button variant="destructive" onClick={discardChanges}>
        Reset
      </Button>
      <Button variant="default" onClick={saveChanges}>
        Save
      </Button>
    </div>
  );
}
