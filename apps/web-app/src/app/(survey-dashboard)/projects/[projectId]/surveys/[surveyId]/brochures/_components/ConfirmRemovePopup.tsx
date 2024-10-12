import { Button } from "~/components/ui/button";

export function ConfirmRemovePopup({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="absolute bottom-3 right-3 flex h-[100px] w-[250px] flex-col items-center justify-center gap-2 rounded-lg border-black bg-white p-3">
      <p className="text-lg font-medium">Remove selected items?</p>
      <div className="flex w-full flex-row justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>
          Undo
        </Button>
        <Button onClick={onConfirm}>Remove</Button>
      </div>
    </div>
  );
}
