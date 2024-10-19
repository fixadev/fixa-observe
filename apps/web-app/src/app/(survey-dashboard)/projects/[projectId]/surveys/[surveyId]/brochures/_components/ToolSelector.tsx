import { EraserIcon, TextNoneIcon } from "@radix-ui/react-icons";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

export type Tool = "eraser" | "selector";

export default function ToolSelector({
  tool,
  onToolChange,
  isMouseDown,
}: {
  tool: Tool;
  onToolChange: (tool: Tool) => void;
  isMouseDown: boolean;
}) {
  if (isMouseDown) {
    return null;
  }
  return (
    <ToggleGroup
      className="absolute right-0 top-0 flex flex-col gap-2"
      type="single"
      value={tool}
      onValueChange={(val) => {
        if (val) {
          onToolChange(val as Tool);
        }
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            className={cn(tool === "selector" ? "bg-muted" : "bg-white")}
            value="selector"
            variant="outline"
            size="icon"
          >
            <TextNoneIcon />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent side="left">Select and delete text</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            className={cn(tool === "eraser" ? "bg-muted" : "bg-white")}
            value="eraser"
            variant="outline"
            size="icon"
          >
            <EraserIcon />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent side="left">Erase logos</TooltipContent>
      </Tooltip>
    </ToggleGroup>
  );
}
