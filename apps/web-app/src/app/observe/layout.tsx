"use client";

import {
  ObserveStateProvider,
  useObserveState,
} from "~/components/hooks/useObserveState";
import ObserveSidebar from "~/components/observe/ObserveSidebar";
import { SidebarProvider } from "~/components/ui/sidebar";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

function ObserveLayout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "true";
  const { setIsDemo } = useObserveState();

  useEffect(() => {
    setIsDemo(isDemo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SidebarProvider>
      <ObserveSidebar />
      <main className="flex-1">{children}</main>
    </SidebarProvider>
  );
}

export default function ObserveStateWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ObserveStateProvider>
      <ObserveLayout>{children}</ObserveLayout>
    </ObserveStateProvider>
  );
}
