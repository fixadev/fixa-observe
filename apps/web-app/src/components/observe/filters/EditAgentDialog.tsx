import { useState, useMemo } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import Spinner from "~/components/Spinner";
import { api } from "~/trpc/react";

interface EditAgentDisplayNamesDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  refetchAgents: () => void;
}

export function EditAgentDisplayNamesDialog({
  open,
  setOpen,
  refetchAgents,
}: EditAgentDisplayNamesDialogProps) {
  const { data: agents } = api.agent.getAll.useQuery();
  const [search, setSearch] = useState("");

  const { mutateAsync: updateAgentName, isPending: isUpdating } =
    api.agent.updateName.useMutation();
  const [editedNames, setEditedNames] = useState<Record<string, string>>({});

  const filteredAgents = useMemo(() => {
    if (!agents) return [];
    return agents.filter(
      (agent) =>
        agent.customerAgentId?.trim() &&
        // search by agent id or name
        (agent.customerAgentId.toLowerCase().includes(search.toLowerCase()) ||
          agent.name.toLowerCase().includes(search.toLowerCase())),
    );
  }, [agents, search]);

  const handleSubmit = async () => {
    for (const [id, name] of Object.entries(editedNames)) {
      await updateAgentName({ id, name });
    }
    setOpen(false);
    void refetchAgents();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex h-[600px] min-w-[600px] flex-col">
        <DialogHeader>
          <DialogTitle>edit display names</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Input
            placeholder="Search agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="font-medium">agent ID</div>
            <div className="font-medium">display name</div>
          </div>

          {filteredAgents.map((agent) => (
            <div key={agent.id} className="grid grid-cols-2 gap-4">
              <Input
                className="w-full"
                value={agent.customerAgentId ?? ""}
                readOnly
                disabled
              />
              <Input
                className="w-full"
                value={editedNames[agent.id] ?? agent.name}
                onChange={(e) => {
                  e.stopPropagation();
                  setEditedNames((prev) => ({
                    ...prev,
                    [agent.id]: e.target.value,
                  }));
                }}
              />
            </div>
          ))}
        </div>

        <DialogFooter className="mt-auto">
          <Button className="mt-4" onClick={handleSubmit} disabled={isUpdating}>
            {isUpdating ? <Spinner /> : "save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
