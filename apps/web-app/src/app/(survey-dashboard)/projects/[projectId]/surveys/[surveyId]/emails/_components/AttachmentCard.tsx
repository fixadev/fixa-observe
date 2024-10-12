import {
  CheckCircleIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  PaperClipIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
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
import { useSurvey } from "~/hooks/useSurvey";
import { base64ToArrayBuffer, downloadBase64File } from "~/lib/utils";
import { api } from "~/trpc/react";

export default function AttachmentCard({
  attachment: _attachment,
  propertyId,
}: {
  attachment: Attachment;
  propertyId: string;
}) {
  const { refetchSurvey } = useSurvey();

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

  const { mutateAsync: updateAttachment } =
    api.email.updateAttachment.useMutation();
  const { mutateAsync: getAttachmentContent } =
    api.email.getAttachmentContent.useMutation();
  const { mutateAsync: createBrochure } =
    api.property.createBrochure.useMutation();

  const dismissInfoMessage = useCallback(async () => {
    setAttachment((prev) => ({
      ...prev,
      infoMessageDismissed: true,
    }));
    try {
      await updateAttachment({
        emailId: attachment.emailId,
        attachmentId: attachment.id,
        attachment: { infoMessageDismissed: true },
      });
      void refetchSurvey();
    } catch (error) {
      console.error(error);
      setAttachment((prev) => ({
        ...prev,
        infoMessageDismissed: false,
      }));
    }
  }, [attachment.emailId, attachment.id, updateAttachment, refetchSurvey]);

  const [isReplacingBrochure, setIsReplacingBrochure] = useState(false);
  const replaceBrochure = useCallback(async () => {
    setIsReplacingBrochure(true);
    setAttachment((prev) => ({
      ...prev,
      brochureReplaced: true,
    }));
    try {
      // Get the attachment content
      const content = await getAttachmentContent({
        emailId: attachment.emailId,
        attachmentId: attachment.id,
      });
      const blob = new Blob([base64ToArrayBuffer(content)], {
        type: attachment.contentType,
      });

      // Upload the file to S3
      const formData = new FormData();
      formData.append("file", blob, crypto.randomUUID());
      const response = await axios.post<{ url: string; type: string }>(
        "/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // Create the brochure in the database
      await createBrochure({
        propertyId,
        brochure: {
          createdAt: new Date(),
          updatedAt: new Date(),
          title: attachment.name,
          url: response.data.url,
          approved: false,
        },
      });

      // Update brochureReplaced to true
      await updateAttachment({
        emailId: attachment.emailId,
        attachmentId: attachment.id,
        attachment: { brochureReplaced: true },
      });

      void refetchSurvey();
    } catch (error) {
      console.error(error);
      setAttachment((prev) => ({
        ...prev,
        brochureReplaced: false,
      }));
    } finally {
      setIsReplacingBrochure(false);
    }
  }, [
    getAttachmentContent,
    attachment.emailId,
    attachment.id,
    attachment.contentType,
    attachment.name,
    createBrochure,
    propertyId,
    updateAttachment,
    refetchSurvey,
  ]);

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
        <div className="relative flex size-14 shrink-0 items-center justify-center rounded-l-md bg-muted text-muted-foreground">
          <div className="relative">
            {isPdf ? (
              <DocumentTextIcon className="size-6" />
            ) : isImage ? (
              <PhotoIcon className="size-6" />
            ) : (
              <PaperClipIcon className="size-6" />
            )}
            {attachment.brochureReplaced && (
              <div className="absolute -bottom-1 -right-1 rounded-full bg-muted">
                {isReplacingBrochure ? (
                  <Spinner className="m-px size-3.5" />
                ) : (
                  <CheckCircleIcon className="size-4 text-green-500" />
                )}
              </div>
            )}
          </div>
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
              {isPdf && (
                <DropdownMenuItem
                  onClick={replaceBrochure}
                  className="cursor-pointer"
                >
                  Replace brochure
                </DropdownMenuItem>
              )}
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
      {!attachment.infoMessageDismissed &&
        !attachment.brochureReplaced &&
        isPdf && (
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