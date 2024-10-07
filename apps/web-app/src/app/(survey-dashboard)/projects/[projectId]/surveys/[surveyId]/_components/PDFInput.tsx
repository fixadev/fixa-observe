import { cloneElement, type ReactElement, useRef } from "react";

export const PDFInput = ({
  triggerElement,
  className,
  handleFilesChange,
}: {
  triggerElement: ReactElement;
  className?: string;
  handleFilesChange: (files: FileList) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  const acceptablePDFFileTypes = "application/pdf";

  const onFilesChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFilesChange(files);
    }
  };

  return (
    <div className={className}>
      {cloneElement(triggerElement, {
        onClick: (e: React.MouseEvent) => {
          (triggerElement.props.onClick as React.MouseEventHandler)?.(e);
          handleButtonClick();
        },
      })}
      <input
        ref={fileInputRef}
        type="file"
        id="pdfFileSelector"
        className="hidden"
        accept={acceptablePDFFileTypes}
        onChange={onFilesChangeHandler}
      />
    </div>
  );
};
