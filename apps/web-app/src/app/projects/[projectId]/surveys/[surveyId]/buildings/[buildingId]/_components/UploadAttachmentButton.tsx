"use client";

import axios from "axios";
import { useRef } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export default function UploadAttachmentButton({
  buildingId,
  onUpload,
}: {
  buildingId: string;
  onUpload: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { mutate: uploadAttachment } =
    api.building.addAttachmentToBuilding.useMutation();

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
    uploadAttachment({
      buildingId,
      attachmentUrl: data.url,
      title: file.name,
      type: data.type,
    });
    onUpload();
  };

  return (
    <>
      <Button variant="outline" onClick={handleButtonClick}>
        Add an attachment
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
