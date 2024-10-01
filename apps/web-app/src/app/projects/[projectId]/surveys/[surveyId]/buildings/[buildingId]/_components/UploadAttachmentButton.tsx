"use client";

import { useRef } from "react";
import { Button } from "~/components/ui/button";

export default function UploadAttachmentButton() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const onFileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    console.log("file", file);
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
