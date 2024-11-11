import LayoutHeader from "~/components/dashboard/LayoutHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <LayoutHeader />
      {children}
    </div>
  );
}
