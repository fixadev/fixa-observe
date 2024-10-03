import { UserButton } from "@clerk/nextjs";
import Logo from "~/components/Logo";

export default function TopBar() {
  return (
    <div className="fixed z-50 w-full border-b bg-background">
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between">
          <Logo />
          <UserButton />
        </div>
      </div>
    </div>
  );
}
