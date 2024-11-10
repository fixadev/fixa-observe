import { PlusIcon } from "@heroicons/react/24/solid";
import { Button } from "~/components/ui/button";
import AgentCard from "~/components/dashboard/AgentCard";
import { TEST_AGENT } from "~/lib/test-data";
import { AddAgentModal } from "~/app/_components/AddAgentModal";

export default function DashboardPage() {
  return (
    <div className="container">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-medium">agents.</div>
        <AddAgentModal>
          <Button className="flex items-center gap-2">
            <PlusIcon className="size-4" /> create agent
          </Button>
        </AddAgentModal>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AgentCard agent={TEST_AGENT} />
      </div>
    </div>
  );
}
