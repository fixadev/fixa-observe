"use client";

import {
  ClipboardIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import {
  oneLight,
  type PrismLangauge,
  CodeBlock as ReactEmailCodeBlock,
} from "@react-email/code-block";
import { Button } from "./ui/button";
import { useState } from "react";

export default function CodeBlock({
  code,
  language = "ts",
  lineNumbers = false,
  hidden = false,
}: {
  code: string;
  language?: string;
  lineNumbers?: boolean;
  hidden?: boolean;
}) {
  const [hideCode, setHideCode] = useState(hidden);

  const toggleHidden = () => {
    setHideCode(!hideCode);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
  };

  return (
    <div className="group relative text-sm">
      {hidden && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          onClick={toggleHidden}
        >
          {hideCode ? (
            <EyeIcon className="size-4" />
          ) : (
            <EyeSlashIcon className="size-4" />
          )}
        </Button>
      )}
      <ReactEmailCodeBlock
        code={hideCode ? "••••••••••••••••••••••••••••••••" : code}
        language={language as PrismLangauge}
        theme={oneLight}
        lineNumbers={lineNumbers}
      />
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        onClick={handleCopy}
      >
        <ClipboardIcon className="size-4" />
      </Button>
    </div>
  );
}
