import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CopyTextProps {
  text: string;
  className?: string;
}

export function CopyText({ text, className }: CopyTextProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative flex w-full items-center", className)}>
      <Input
        readOnly
        value={text}
        className="bg-muted pr-10 text-muted-foreground focus-visible:ring-1"
      />
      <Button
        size="icon"
        variant="ghost"
        onClick={handleCopy}
        className="absolute right-1 h-8 w-8 text-muted-foreground"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        <span className="sr-only">
          {copied ? "Copied" : "Copy to clipboard"}
        </span>
      </Button>
    </div>
  );
}
