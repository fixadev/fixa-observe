import Link from "next/link";
import { SidebarTrigger } from "~/components/ui/sidebar";

export default function ApiKeysPage({
  params,
}: {
  params: { agentId: string };
}) {
  return (
    <div>
      <div className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-input bg-sidebar px-4 lg:h-[60px]">
        <div className="flex flex-1 items-center gap-2">
          <SidebarTrigger />
          <Link href={`/dashboard/${params.agentId}/api-keys`}>
            <div className="font-medium">API keys</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
