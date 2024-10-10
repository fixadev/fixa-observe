import { cloneElement, type ReactElement, useRef } from "react";
import { cn } from "~/lib/utils";

export const FileInput = ({
  triggerElement,
  className,
  accept = "application/pdf",
  handleFilesChange,
}: {
  triggerElement: ReactElement;
  className?: string;
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
      {cloneElement(triggerElement, {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        className: cn(triggerElement.props.className, className),
        onClick: (e: React.MouseEvent) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (triggerElement.props.onClick as React.MouseEventHandler)?.(e);
          handleButtonClick();
        },
      })}
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
