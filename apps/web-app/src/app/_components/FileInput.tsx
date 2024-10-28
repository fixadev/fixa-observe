import { useRef, type ReactNode, forwardRef } from "react";

interface FileInputProps {
  children: ReactNode;
  accept?: string;
  handleFilesChange: (files: FileList) => void;
}

export const FileInput = forwardRef<HTMLDivElement, FileInputProps>(
  ({ children, accept = "application/pdf", handleFilesChange }, ref) => {
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
        <div
          ref={ref}
          onClick={handleButtonClick}
          className="inline cursor-pointer"
        >
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
  },
);

FileInput.displayName = "FileInput";
