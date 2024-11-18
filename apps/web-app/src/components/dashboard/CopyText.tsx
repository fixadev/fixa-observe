import { useCallback, useState } from "react";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CopyTextProps {
  text: string;
  sensitive?: boolean;
  size?: "xs" | "sm";
  className?: string;
}

export function CopyText({
  text,
  sensitive = false,
  size = "sm",
  className,
}: CopyTextProps) {
  const [copied, setCopied] = useState(false);
  const [showSensitive, setShowSensitive] = useState(false);

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
    <div className={cn("relative flex w-full items-center", className)}>
      <Input
        readOnly
        value={text}
        className={cn(
          "bg-muted text-sm text-muted-foreground focus-visible:ring-1",
          sensitive ? "pr-20" : "pr-10",
          size === "xs" && "py-1 text-xs",
        )}
        type={sensitive && !showSensitive ? "password" : "text"}
      />
      {sensitive && (
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setShowSensitive(!showSensitive)}
          className={cn(
            "absolute right-9 h-8 w-8 text-muted-foreground",
            size === "xs" && "size-6",
          )}
        >
          {showSensitive ? (
            <EyeOff className={cn(size === "xs" ? "h-3 w-3" : "h-4 w-4")} />
          ) : (
            <Eye className={cn(size === "xs" ? "h-3 w-3" : "h-4 w-4")} />
          )}
          <span className="sr-only">
            {showSensitive ? "Hide sensitive text" : "Show sensitive text"}
          </span>
        </Button>
      )}
      <Button
        size="icon"
        variant="ghost"
        onClick={handleCopy}
        className={cn(
          "absolute right-1 h-8 w-8 text-muted-foreground",
          size === "xs" && "size-6",
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
        <span className="sr-only">
          {copied ? "Copied" : "Copy to clipboard"}
        </span>
      </Button>
    </div>
  );
}
