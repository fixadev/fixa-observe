"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Bars3Icon,
  DocumentTextIcon,
  EnvelopeIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { UserButton } from "@clerk/nextjs";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useCallback } from "react";
import { removeTrailingSlash } from "~/lib/utils";
import { api } from "~/trpc/react";

const navItems = [
  { href: "/", icon: HomeIcon, label: "Properties" },
  { href: "/emails", icon: EnvelopeIcon, label: "Emails" },
  { href: "/brochures", icon: DocumentTextIcon, label: "Brochures" },
];

export default function SurveyLayout({
  children,
  params,
}: {
  params: { projectId: string; surveyId: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isCurrentPath = useCallback(
    (path: string) => {
      return (
        removeTrailingSlash(pathname) ===
        removeTrailingSlash(
          `/projects/${params.projectId}/surveys/${params.surveyId}${path}`,
        )
      );
    },
    [pathname, params.projectId, params.surveyId],
  );

  const { data: survey } = api.survey.getSurvey.useQuery({
    surveyId: params.surveyId,
  });

  return (
    <div className="grid h-screen w-full md:grid-cols-[200px_1fr] lg:grid-cols-[210px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link
              href={
                pathname.endsWith("pdf-preview")
                  ? `/projects/${params.projectId}/surveys/${params.surveyId}`
                  : `/projects/${params.projectId}`
              }
              className="flex items-center gap-2 font-medium"
            >
              <ChevronLeftIcon className="size-5" />
              <span>
                {pathname.endsWith("pdf-preview")
                  ? "Back to survey"
                  : "Back to surveys"}
              </span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={`/projects/${params.projectId}/surveys/${params.surveyId}${item.href}`}
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
      <div className="flex flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
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
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <span className="sr-only">Titan</span>
                </Link>
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
          </Sheet>
          <div className="flex flex-1 items-center justify-between">
            <span className="text-sm font-medium">{survey?.name}</span>
            <UserButton />
          </div>
        </header>
        {/* <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6"> */}
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
