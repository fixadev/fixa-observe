import { useCallback, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  size?: "xs" | "sm";
  className?: string;
}

export function CopyButton({ text, size = "sm", className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    },
    [text],
  );

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleCopy}
      className={cn(
        "h-8 w-8 text-muted-foreground",
        size === "xs" && "size-6",
        className,
      )}
    >
      {copied ? (
        <Check
          className={cn(
            "text-green-500",
            size === "xs" ? "h-3 w-3" : "h-4 w-4",
          )}
        />
      ) : (
        <Copy className={cn(size === "xs" ? "h-3 w-3" : "h-4 w-4")} />
      )}
      <span className="sr-only">{copied ? "Copied" : "Copy to clipboard"}</span>
    </Button>
  );
}
