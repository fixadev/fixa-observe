import { type Attachment } from "@prisma/client";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import Image from "next/image";
import { PaperClipIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Button } from "~/components/ui/button";
import { type BuildingSchema } from "~/lib/building";
import Spinner from "~/components/Spinner";

export default function AttachmentCard({
  attachment,
  isUploading = false,
  onDelete,
}: {
  attachment: Attachment;
  isUploading?: boolean;
  onDelete?: () => void;
}) {
  return (
    <Card className="group flex items-center justify-between">
      <div className="flex items-center gap-4">
        {isUploading ? (
          <div className="flex h-20 w-20 items-center justify-center rounded-l-xl bg-gray-100">
            <Spinner className="size-5 text-gray-500" />
          </div>
        ) : attachment.type === "image/jpeg" ||
          attachment.type === "image/png" ||
          attachment.type === "image/jpg" ? (
          <Image
            src={attachment.url}
            alt={attachment.title}
            width={100}
            height={100}
            className="h-20 w-20 rounded-l-xl object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-l-xl bg-gray-100">
            <PaperClipIcon className="size-8 text-gray-500" />
          </div>
        )}
        <CardHeader className="p-0">
          <CardTitle>{attachment.title}</CardTitle>
        </CardHeader>
      </div>
      {!isUploading && (
        <Button
          variant="ghost"
          size="icon"
          className="invisible mr-4 group-hover:visible"
          onClick={() => {
            onDelete?.();
          }}
        >
          <TrashIcon className="size-4" />
        </Button>
      )}
    </Card>
  );
}
