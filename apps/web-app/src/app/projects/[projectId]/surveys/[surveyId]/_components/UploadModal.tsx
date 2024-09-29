import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "~/components/ui/dialog";

import { CSVMapper } from "./CSVMapper";
import { type HeaderMappingSchema } from "~/lib/building";

export function UploadModal({
  open,
  csvData,
  setOpen,
  submitHandler,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  csvData: Array<Record<string, string>>;
  submitHandler: (mappedHeaders: HeaderMappingSchema) => void;
}) {
  return (
    <Dialog open={open}>
      <DialogContent className="max-h-[90vh] max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Building Import</DialogTitle>
        </DialogHeader>
        <CSVMapper csvData={csvData} submitHandler={submitHandler} />
      </DialogContent>
    </Dialog>
  );
}
