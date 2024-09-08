import Logo from "~/components/Logo";
import { Button } from "~/components/ui/button";
import { RequestApiAccessBtn } from "./RequestApiAccessBtn";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";

export default function TopBar() {
  return (
    <div className="fixed left-0 top-0 flex h-16 w-full items-center justify-between bg-neutral-900 p-4">
      <Logo />
      {/* mobile menu */}
      <Drawer>
        <DrawerTrigger className="sm:hidden">
          <Button variant="ghost">menu</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>menu</DrawerTitle>
          </DrawerHeader>
          <div className="mb-4 flex flex-col gap-2">
            <Button variant="ghost">
              <a href="mailto:contact@pixa.dev">contact us</a>
            </Button>
            <RequestApiAccessBtn />
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton
                mode="modal"
                forceRedirectUrl="/"
                signUpForceRedirectUrl="/"
              >
                <Button variant="ghost">sign in</Button>
              </SignInButton>
            </SignedOut>
          </div>
        </DrawerContent>
      </Drawer>

      {/* desktop menu */}
      <div className="hidden items-center gap-1 sm:flex sm:gap-4">
        <a href="mailto:contact@pixa.dev">
          <Button variant="ghost">contact us</Button>
        </a>
        <RequestApiAccessBtn />
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton
            mode="modal"
            forceRedirectUrl="/"
            signUpForceRedirectUrl="/"
          >
            <Button variant="ghost">sign in</Button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
}
