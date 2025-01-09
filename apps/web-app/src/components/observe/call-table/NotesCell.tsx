import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { useState } from "react";
import { type CallWithIncludes } from "@repo/types/src";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { api } from "~/trpc/react";
import { useToast } from "~/components/hooks/use-toast";

export const NotesCell = ({ call }: { call: CallWithIncludes }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(call?.notes ?? "");
  const { toast } = useToast();

  const { mutate: updateCall } = api._call.updateNotes.useMutation({
    onSuccess: () => {
      toast({
        title: "Notes updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Failed to update notes",
        variant: "destructive",
      });
    },
  });

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("saving notes", notes, "for call", call.id);
    updateCall({
      callId: call.id,
      notes,
    });
    setIsEditing(false);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto p-0 text-xs text-muted-foreground hover:bg-transparent"
          onClick={(e) => e.stopPropagation()}
        >
          <DocumentTextIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" onClick={(e) => e.stopPropagation()}>
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="cursor-pointer whitespace-pre-wrap p-2 text-sm hover:bg-muted"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            {notes || "click to add notes..."}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
