import Link from "next/link";
import { SidebarTrigger } from "~/components/ui/sidebar";

export default function EvalsPage() {
  return (
    <div className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background p-4">
      <SidebarTrigger />
      <Link href="/observe/evals">
        <div className="font-medium">evaluation criteria</div>
      </Link>
    </div>
  );
}
