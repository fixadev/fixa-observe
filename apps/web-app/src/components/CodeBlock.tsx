"use client";

import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/outline";
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
}: {
  code: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <div className="group relative">
      <ReactEmailCodeBlock
        code={code}
        language={language as PrismLangauge}
        theme={oneLight}
        lineNumbers
      />
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        onClick={handleCopy}
      >
        {copied ? (
          <CheckIcon className="size-4 text-green-500" />
        ) : (
          <ClipboardIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}
