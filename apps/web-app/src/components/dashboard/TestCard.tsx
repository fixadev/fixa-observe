import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { ibmPlexMono } from "~/app/fonts";
import { cn } from "~/lib/utils";

export default function TestCard({
  agentId,
  testId,
}: {
  agentId: string;
  testId: string;
}) {
  return (
    <Link href={`/dashboard/${agentId}/tests/${testId}`}>
      <div className="flex cursor-pointer items-center justify-between border-b border-input p-4 hover:bg-muted">
        <div className="flex items-center gap-2">
          <CheckCircleIcon className="size-8 text-green-500" />
          <div className="font-medium">40/40 checks passed</div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className={cn("text-sm font-medium", ibmPlexMono.className)}>
              main
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn("text-sm font-medium", ibmPlexMono.className)}>
              90abcde fixes stuff
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="text-sm text-muted-foreground">3m ago by jonyTF</div>
        </div>
      </div>
    </Link>
  );
}
