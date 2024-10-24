import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from "@heroicons/react/24/solid";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { EraserIcon, TextNoneIcon } from "@radix-ui/react-icons";

export type Tool = "eraser" | "selector";

export default function ToolSelector({
  tool,
  onToolChange,
  onUndo,
  undoEnabled,
  onRedo,
  redoEnabled,
  isMouseDown,
}: {
  tool: Tool;
  onToolChange: React.Dispatch<React.SetStateAction<Tool>>;
  onUndo: () => void;
  undoEnabled: boolean;
  onRedo: () => void;
  redoEnabled: boolean;
  isMouseDown: boolean;
}) {
  if (isMouseDown) {
    return null;
  }
  return (
    <div className="absolute right-0 top-0 m-1 flex flex-col items-end gap-2">
      <div>
        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-r-none"
          onClick={onUndo}
          disabled={!undoEnabled}
        >
          <ArrowUturnLeftIcon className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="-ml-px size-8 rounded-l-none"
          onClick={onRedo}
          disabled={!redoEnabled}
        >
          <ArrowUturnRightIcon className="size-4" />
        </Button>
      </div>
      <ToggleGroup
        className="flex flex-col gap-2"
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
          <TooltipContent side="left">Delete text and logos</TooltipContent>
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
          <TooltipContent side="left">Erase with AI</TooltipContent>
        </Tooltip>
      </ToggleGroup>
    </div>
  );
}
