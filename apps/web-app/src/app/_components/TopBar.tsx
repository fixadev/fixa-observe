import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import Link from "next/link";
import Logo from "~/components/Logo";
import { Button } from "~/components/ui/button";

export default function TopBar() {
  return (
    <div className="fixed z-50 w-full bg-background">
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <SignedOut>
              <Button variant="ghost" asChild>
                <SignInButton />
              </Button>
            </SignedOut>
            <SignedIn>
              <Button variant="ghost" asChild>
                <SignOutButton />
              </Button>
              <Button asChild>
                <Link href="/projects">Dashboard</Link>
              </Button>
            </SignedIn>
          </div>
        </div>
      </div>
    </div>
  );
}
