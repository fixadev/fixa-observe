import Spinner from "~/components/Spinner";
import { Button } from "~/components/ui/button";

export function ConfirmRemovePopup({
  title,
  cancelText,
  confirmText,
  isLoading = false,
  onConfirm,
  onCancel,
}: {
  title: string;
  cancelText: string;
  confirmText: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="absolute bottom-1 right-0 flex flex-col items-center justify-center gap-2 rounded-md border border-input bg-white p-3 shadow-sm">
      <p className="text-lg font-medium">{title}</p>
      <div className="flex w-full flex-row justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button onClick={onConfirm} disabled={isLoading}>
          {isLoading ? <Spinner /> : confirmText}
        </Button>
      </div>
    </div>
  );
}
