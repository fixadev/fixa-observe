import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CopyButton } from "./CopyButton";

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
  const [showSensitive, setShowSensitive] = useState(false);

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
      <CopyButton text={text} size={size} className="absolute right-1" />
    </div>
  );
}
