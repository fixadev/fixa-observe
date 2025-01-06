import Link from "next/link";
import { SidebarTrigger } from "./ui/sidebar";

export function DashboardPageHeader({
  title,
  href,
  children,
}: {
  title: string;
  href?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-input bg-sidebar px-4 lg:h-[60px]">
      <div className="flex flex-1 items-center gap-2">
        <SidebarTrigger />
        {href ? (
          <Link href={href}>
            <div className="font-medium">{title}</div>
          </Link>
        ) : (
          <div className="font-medium">{title}</div>
        )}
      </div>
      {children}
    </div>
  );
}
