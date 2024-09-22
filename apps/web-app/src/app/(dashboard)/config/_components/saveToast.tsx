import { Button } from "~/components/ui/button";

export function PersistentToast({
  saveChanges,
  discardChanges,
}: {
  saveChanges: () => void;
  discardChanges: () => void;
}) {
  return (
    <div className="absolute bottom-0 flex flex-row gap-2 rounded-lg border-[2px] border-gray-200 px-4 py-2">
      <Button variant="destructive" onClick={discardChanges}></Button>
      <Button variant="default" onClick={saveChanges}>
        Save
      </Button>
    </div>
  );
}
