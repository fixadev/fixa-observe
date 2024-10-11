import {
  ChevronDownIcon,
  DocumentTextIcon,
  PaperClipIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";
import { type Attachment } from "prisma/generated/zod";
import { useCallback } from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export default function AttachmentCard({
  attachment,
}: {
  attachment: Attachment;
}) {
  const formatBytes = useCallback((bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }, []);

  const isPdf = attachment.contentType.includes("pdf");
  const isImage = attachment.contentType.includes("image");

  return (
    <div>
      <div className="flex min-w-20 items-center rounded-md border border-input">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-l-md bg-muted text-muted-foreground">
          {isPdf ? (
            <DocumentTextIcon className="size-6" />
          ) : isImage ? (
            <PhotoIcon className="size-6" />
          ) : (
            <PaperClipIcon className="size-6" />
          )}
        </div>
        <div className="flex-1 p-2">
          <div className="text-sm">{attachment.name}</div>
          <div className="text-xs text-muted-foreground">
            {formatBytes(attachment.size)}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-auto self-stretch rounded-l-none"
            >
              <ChevronDownIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="cursor-pointer">
              Replace brochure
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Download
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        Replace brochure with this file?{" "}
        <Button variant="link" size="sm" className="h-auto p-2">
          Yes
        </Button>
        <Button variant="link" size="sm" className="h-auto p-2">
          No
        </Button>
      </div>
    </div>
  );
}
