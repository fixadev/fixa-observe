import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { type Agent } from "@repo/types/src/index";
import { Button } from "~/components/ui/button";
import { useMemo } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { api } from "~/trpc/react";

export default function AgentCard({ agent }: { agent: Agent }) {
  const formattedGithubUrl = useMemo(() => {
    if (agent.githubRepoUrl) {
      return agent.githubRepoUrl.replace(
        /^https?:\/\/(www\.)?github\.com\//,
        "",
      );
    }
    return null;
  }, [agent.githubRepoUrl]);

  const { data: lastTest } = api.test.getLastTest.useQuery({
    agentId: agent.id,
  });

  return (
    <Link href={`/dashboard/${agent.id}`}>
      <div className="flex cursor-pointer flex-col gap-2 rounded-md border border-input bg-background p-4 shadow-sm hover:bg-muted/50">
        <div className="flex w-full items-center justify-between gap-8">
          <div className="flex flex-col">
            <div className="text-lg font-medium">{agent.name}</div>
            <div className="text-sm text-muted-foreground">
              {agent.phoneNumber}
            </div>
          </div>
          <Button size="sm" variant="outline">
            edit
          </Button>
        </div>
        {formattedGithubUrl && (
          <div className="flex w-fit items-center gap-2 rounded-full border border-input bg-background px-2 py-1">
            <GitHubLogoIcon className="size-4" />
            <div className="text-xs">{formattedGithubUrl}</div>
          </div>
        )}
        <div className="text-sm text-muted-foreground">
          last tested{" "}
          {lastTest
            ? formatDistanceToNow(lastTest.createdAt) + " ago"
            : "never"}
        </div>
      </div>
    </Link>
  );
}
