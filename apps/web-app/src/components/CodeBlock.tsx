"use client";

import { ClipboardIcon } from "@heroicons/react/24/outline";
import {
  oneLight,
  type PrismLangauge,
  CodeBlock as ReactEmailCodeBlock,
} from "@react-email/code-block";
import { Button } from "./ui/button";

export default function CodeBlock({
  code,
  language = "ts",
}: {
  code: string;
  language?: string;
}) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
  };

  return (
    <div className="group relative text-sm">
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
        <ClipboardIcon className="size-4" />
      </Button>
    </div>
  );
}
