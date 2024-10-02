"use client";

import axios from "axios";
import { useRef } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export function UploadFileButton({
  buildingId,
  fileType = "attachment",
  onUploaded,
}: {
  buildingId: string;
  fileType: "attachment" | "image";
  onUploaded?: (data?: string[]) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { mutate: uploadAttachment } =
    api.building.addAttachmentToBuilding.useMutation({
      onSuccess: (data) => {
        onUploaded?.();
      },
    });

  const { mutate: addPhotosToBuilding } =
    api.building.addPhotosToBuilding.useMutation({
      onSuccess: (data) => {
        onUploaded?.(data);
      },
    });

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const onFileChangeHandler = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const result = await axios.post("/upload", formData);
    const data = result.data as { url: string; type: string };
    if (fileType === "attachment") {
      uploadAttachment({
        buildingId,
        attachmentUrl: data.url,
        title: file.name,
        type: data.type,
      });
    } else if (fileType === "image") {
      addPhotosToBuilding({
        buildingId,
        photos: [data.url],
      });
    }
  };

  return (
    <>
      <Button variant="outline" onClick={handleButtonClick}>
        Upload {fileType === "attachment" ? "attachment" : "image"}
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        id="attachmentFileSelector"
        className="hidden"
        onChange={onFileChangeHandler}
      />
    </>
  );
}
