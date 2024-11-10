import { PlusIcon } from "@heroicons/react/24/solid";
import { Button } from "~/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="container pt-16">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-medium">agents.</div>
        <Button className="flex items-center gap-2">
          <PlusIcon className="size-4" /> create agent
        </Button>
      </div>
    </div>
  );
}
