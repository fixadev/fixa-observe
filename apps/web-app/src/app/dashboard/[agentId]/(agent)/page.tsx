import { RocketLaunchIcon } from "@heroicons/react/24/solid";
import { Button } from "~/components/ui/button";
import TestCard from "~/components/dashboard/TestCard";
import Link from "next/link";

export default function AgentPage({ params }: { params: { agentId: string } }) {
  return (
    <div>
      {/* header */}
      <div className="container flex items-center justify-between py-8">
        <div className="text-2xl font-medium">tests</div>
        <div className="flex gap-2">
          <Button variant="outline" size="lg">
            configure test agents
          </Button>
          <Button size="lg" className="flex items-center gap-2">
            run test <RocketLaunchIcon className="size-4" />
          </Button>
        </div>
      </div>
      <div className="h-px w-full bg-input" />

      {/* content */}
      <div className="container py-8">
        <div className="rounded-t-md border-x border-t border-input shadow-sm">
          {Array.from({ length: 6 }).map((_, i) => (
            <Link href={`/dashboard/${params.agentId}/tests/${i + 1}`} key={i}>
              <TestCard className="cursor-pointer hover:bg-muted" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
