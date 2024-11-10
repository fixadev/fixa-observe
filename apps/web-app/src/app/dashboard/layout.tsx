import { UserButton } from "@clerk/nextjs";
import Logo from "~/components/Logo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <div className="flex w-full items-center justify-between p-4">
        <Logo href="/dashboard" />
        <UserButton />
      </div>
      {children}
    </div>
  );
}
