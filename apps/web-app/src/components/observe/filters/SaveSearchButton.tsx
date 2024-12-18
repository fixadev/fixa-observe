import { useState, useCallback, useEffect } from "react";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { InputWithLabel } from "~/app/_components/InputWithLabel";
import Spinner from "~/components/Spinner";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { cn } from "~/lib/utils";
import { useObserveState } from "~/components/hooks/useObserveState";
import type { SavedSearchWithIncludes } from "@repo/types/src";

interface SaveSearchButtonProps {
  savedSearch?: SavedSearchWithIncludes;
}

export default function SaveSearchButton({
  savedSearch,
}: SaveSearchButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"create-or-update" | "create">("create");
  const { filter } = useObserveState();
  const utils = api.useUtils();

  const reset = useCallback(() => {
    setName("");
    if (savedSearch?.isDefault) {
      setState("create");
    } else {
      setState("create-or-update");
    }
  }, [savedSearch]);

  useEffect(() => {
    reset();
  }, [reset]);
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        reset();
      }, 200);
    }
  }, [open, reset]);

  const [name, setName] = useState("");

  const { mutate: saveSearch, isPending: isSaving } =
    api.search.save.useMutation({
      onSuccess: async (data) => {
        void utils.search.getAll.invalidate();
        setOpen(false);
        router.push("/observe/saved/" + data.id);
      },
    });

  const { mutate: updateSavedSearch, isPending: isUpdating } =
    api.search.update.useMutation({
      onSuccess: () => {
        void utils.search.getAll.invalidate();
        setOpen(false);
      },
    });

  const handleUpdate = useCallback(() => {
    if (!savedSearch) return;

    updateSavedSearch({
      ...savedSearch,
      ...filter,
      timeRange: undefined,
      customerCallId: undefined,
    });
  }, [filter, savedSearch, updateSavedSearch]);

  const handleCreate = useCallback(
    (name: string) => {
      saveSearch({
        filter: {
          ...filter,
          timeRange: undefined,
          customerCallId: undefined,
        },
        name,
      });
    },
    [filter, saveSearch],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className={cn(open && "bg-muted")}>
          save search
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-4">
          {state === "create-or-update" ? (
            <div className="flex flex-col gap-2">
              <Button onClick={handleUpdate} disabled={isUpdating}>
                {isUpdating ? <Spinner /> : "update existing"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setState("create")}
                disabled={isUpdating}
              >
                save new
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <InputWithLabel
                label="name"
                placeholder="EU outbound..."
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreate(name);
                  }
                }}
                className="w-full"
              />
              <Button onClick={() => handleCreate(name)} disabled={isSaving}>
                {isSaving ? <Spinner /> : "save"}
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
