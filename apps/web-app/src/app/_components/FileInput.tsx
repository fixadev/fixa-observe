import { useRef, type ReactNode } from "react";

export const FileInput = ({
  children,
  accept = "application/pdf",
  handleFilesChange,
}: {
  children: ReactNode;
  accept?: string;
  handleFilesChange: (files: FileList) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const onFilesChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFilesChange(files);
    }
  };

  return (
    <>
      <div onClick={handleButtonClick} className="inline cursor-pointer">
        {children}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        id="pdfFileSelector"
        className="hidden"
        accept={accept}
        onChange={onFilesChangeHandler}
      />
    </>
  );
};
