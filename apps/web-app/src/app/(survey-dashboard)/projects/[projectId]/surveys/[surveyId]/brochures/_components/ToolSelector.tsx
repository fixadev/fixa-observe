import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from "@heroicons/react/24/solid";
import { Button } from "~/components/ui/button";

export type Tool = "eraser" | "selector";

export default function ToolSelector({
  onUndo,
  undoEnabled,
  onRedo,
  redoEnabled,
  isMouseDown,
}: {
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
      {/* <ToggleGroup
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
      </ToggleGroup> */}
    </div>
  );
}
