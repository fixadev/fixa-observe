import { ObserveStateProvider } from "~/components/hooks/useObserveState";
import ObserveSidebar from "~/components/observe/ObserveSidebar";
import { SidebarProvider } from "~/components/ui/sidebar";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "fixa | observability",
  description: "run tests, analyze calls, fix bugs in your voice agents",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function ObserveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ObserveStateProvider>
      <SidebarProvider>
        <ObserveSidebar />
        <main className="flex-1">{children}</main>
      </SidebarProvider>
    </ObserveStateProvider>
  );
}
