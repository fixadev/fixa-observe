"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useProject } from "~/app/contexts/projectContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Bars3Icon,
  Cog6ToothIcon,
  HomeIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { UserButton } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const navItems = [
  { href: "/", icon: HomeIcon, label: "dashboard" },
  { href: "/config", icon: Cog6ToothIcon, label: "configuration" },
  { href: "/quickstart", icon: RocketLaunchIcon, label: "quickstart" },
];

export default function NavWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const { selectedProject, setSelectedProject, projects, isLoading } =
    useProject();

  useEffect(() => {
    if (projects) {
      console.log("PROJECTS", projects);
      console.log("SELECTED PROJECT", selectedProject);
    }
  }, [projects, selectedProject, setSelectedProject]);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="">pixa.dev</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <div className="py-2">
                {selectedProject?.id && (
                  <Select
                    onValueChange={(value) => {
                      const project = projects?.find(
                        (project) => project.id === value,
                      );
                      if (project) {
                        setSelectedProject(project);
                      }
                    }}
                    defaultValue={selectedProject?.id}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects?.map((project) => (
                        <SelectItem
                          className="cursor-pointer"
                          value={project.id}
                          key={project.id}
                        >
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    pathname === item.href
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
      <div className="flex flex-col">
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
                  <span className="sr-only">pixa.dev</span>
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
          <div className="ml-auto">
            <UserButton />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
