import {
  ChevronDownIcon,
  DocumentTextIcon,
  PaperClipIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";
import { type Attachment } from "prisma/generated/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import Spinner from "~/components/Spinner";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { downloadBase64File } from "~/lib/utils";
import { api } from "~/trpc/react";

export default function AttachmentCard({
  attachment: _attachment,
}: {
  attachment: Attachment;
}) {
  const [attachment, setAttachment] = useState<Attachment>(_attachment);
  useEffect(() => {
    setAttachment(_attachment);
  }, [_attachment]);

  const formatBytes = useCallback((bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }, []);
  const isPdf = useMemo(
    () => attachment.contentType.includes("pdf"),
    [attachment.contentType],
  );
  const isImage = useMemo(
    () => attachment.contentType.includes("image"),
    [attachment.contentType],
  );

  const { mutateAsync: dismissAttachmentInfoMessage } =
    api.email.dismissAttachmentInfoMessage.useMutation();
  const dismissInfoMessage = useCallback(() => {
    // Implementation for replacing brochure
    setAttachment((prev) => ({
      ...prev,
      infoMessageDismissed: true,
    }));
    void dismissAttachmentInfoMessage({
      emailId: attachment.emailId,
      attachmentId: attachment.id,
    });
  }, [attachment.emailId, attachment.id, dismissAttachmentInfoMessage]);
  const replaceBrochure = useCallback(() => {
    // Implementation for replacing brochure
    dismissInfoMessage();
  }, [dismissInfoMessage]);

  const { mutateAsync: getAttachmentContent } =
    api.email.getAttachmentContent.useMutation();
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadAttachment = useCallback(async () => {
    setIsDownloading(true);
    try {
      const content = await getAttachmentContent({
        emailId: attachment.emailId,
        attachmentId: attachment.id,
      });
      downloadBase64File(attachment.name, attachment.contentType, content);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  }, [
    attachment.contentType,
    attachment.emailId,
    attachment.id,
    attachment.name,
    getAttachmentContent,
  ]);

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
        {!isDownloading ? (
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
              <DropdownMenuItem
                onClick={replaceBrochure}
                className="cursor-pointer"
              >
                Replace brochure
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={downloadAttachment}
                className="cursor-pointer"
              >
                Download
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex w-9 items-center justify-center p-1">
            <Spinner />
          </div>
        )}
      </div>
      {!attachment.infoMessageDismissed && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          Replace brochure with this file?{" "}
          <Button
            onClick={replaceBrochure}
            variant="link"
            size="sm"
            className="h-auto p-2"
          >
            Yes
          </Button>
          <Button
            onClick={dismissInfoMessage}
            variant="link"
            size="sm"
            className="h-auto p-2"
          >
            No
          </Button>
        </div>
      )}
    </div>
  );
}
