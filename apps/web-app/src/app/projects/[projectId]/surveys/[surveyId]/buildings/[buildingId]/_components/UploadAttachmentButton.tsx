"use client";

import { useRef } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export default function UploadAttachmentButton() {
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
    const result = await fetch("/upload", {
      method: "POST",
      body: formData,
    });
    console.log("result", result);
    // uploadAttachment({
    //   buildingId: "1",
    //   attachment: result.url,
    //   title: file.name,
    //   type: file.type,
    // });
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
