// import {
//   SignedIn,
//   SignedOut,
//   SignInButton,
//   SignOutButton,
// } from "@clerk/nextjs";
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
            {/* <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost">sign in</Button>
              </SignInButton> */}
            {/* <Button size="lg" variant="outline" asChild>
                <Link
                  href="https://cal.com/team/fixa/20-minute-meeting"
                  target="_blank"
                >
                  book demo
                </Link>
              </Button> */}
            {/* </SignedOut>
            <SignedIn>
              <SignOutButton>
                <Button variant="ghost">sign out</Button>
              </SignOutButton>
              <Button asChild>
                <Link href="/dashboard/new">dashboard</Link>
              </Button>
            </SignedIn> */}
          </div>
        </div>
      </div>
    </div>
  );
}
