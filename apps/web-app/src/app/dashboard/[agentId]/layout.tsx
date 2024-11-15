"use client";

// export default function AgentLayout({
//   params,
//   children,
// }: {
//   params: { agentId: string };
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const tabValue = useMemo(() => {
//     if (pathname.endsWith("/settings")) return "settings";
//     if (pathname.endsWith("/scenarios")) return "scenarios";
//     return "tests";
//   }, [pathname]);
//   const tabs = useMemo(() => {
//     return [
//       { value: "tests", label: "tests", href: `/dashboard/${params.agentId}` },
//       {
//         value: "scenarios",
//         label: "scenarios",
//         href: `/dashboard/${params.agentId}/scenarios`,
//       },
//       {
//         value: "settings",
//         label: "settings",
//         href: `/dashboard/${params.agentId}/settings`,
//       },
//     ];
//   }, [params.agentId]);

//   return (
//     <div>
//       <LayoutHeader tabValue={tabValue} tabs={tabs} agentId={params.agentId} />
//       {children}
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Bars3Icon,
  ChatBubbleOvalLeftIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { UserButton } from "@clerk/nextjs";
import { useCallback } from "react";
import { removeTrailingSlash } from "~/lib/utils";
import Logo from "~/components/Logo";
import { CounterClockwiseClockIcon } from "@radix-ui/react-icons";
import {} from "@heroicons/react/24/solid";
import { api } from "~/trpc/react";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
// import { SurveyProvider, useSurvey } from "~/hooks/useSurvey";

const navItems = [
  { href: "/", icon: CounterClockwiseClockIcon, label: "test history" },
  { href: "/scenarios", icon: ChatBubbleOvalLeftIcon, label: "scenarios" },
  { href: "/settings", icon: Cog6ToothIcon, label: "settings" },
];

export default function AgentLayout({
  children,
  params,
}: {
  params: { agentId: string };
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const isCurrentPath = useCallback(
    (path: string) => {
      return (
        removeTrailingSlash(pathname) ===
        removeTrailingSlash(`/dashboard/${params.agentId}${path}`)
      );
    },
    [pathname, params.agentId],
  );

  const { data: agents } = api.agent.getAll.useQuery();

  return (
    <div className="flex min-h-screen w-full">
      <div className="sticky top-0 hidden h-screen w-[200px] shrink-0 border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Logo href="/dashboard" />
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Select
                value={params.agentId}
                onValueChange={(value) => {
                  router.push(`/dashboard/${value}`);
                }}
              >
                <SelectTrigger className="mb-2 bg-background">
                  <SelectValue placeholder="Select an agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents?.map((agent) => (
                    <SelectItem
                      className="cursor-pointer"
                      key={agent.id}
                      value={agent.id}
                    >
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={`/dashboard/${params.agentId}${item.href}`}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    isCurrentPath(item.href)
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex-1">
        {/* <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Bars3Icon className="size-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Logo href="/dashboard" />
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${
                      pathname === item.href
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet> */}
        {/* <div className="flex flex-1 items-center justify-between">
            <span className="text-sm font-medium">{survey?.name}</span>
            <UserButton />
          </div> */}
        {/* </header> */}
        {/* <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6"> */}
        {children}
      </div>
    </div>
  );
}
