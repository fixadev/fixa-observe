import { ObserveStateProvider } from "~/components/hooks/useObserveState";
import ObserveSidebar from "~/components/observe/ObserveSidebar";
import { SidebarProvider } from "~/components/ui/sidebar";

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
