import { Button } from "~/components/ui/button";

export function PersistentToast({
  saveChanges,
  discardChanges,
}: {
  saveChanges: () => void;
  discardChanges: () => void;
}) {
  return (
    <div className="flex flex-row gap-2 p-4">
      <Button variant="destructive" onClick={discardChanges}></Button>
      <Button variant="default" onClick={saveChanges}>
        Save
      </Button>
    </div>
  );
}
