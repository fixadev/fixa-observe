import Logo from "~/components/Logo";
import { Button } from "~/components/ui/button";
import { RequestApiAccessBtn } from "./RequestApiAccessBtn";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Bars3Icon } from "@heroicons/react/24/solid";

export default function TopBar() {
  return (
    <div className="fixed left-0 top-0 flex h-16 w-full items-center justify-between bg-neutral-900 p-4">
      <Logo />
      {/* mobile menu */}
      <Drawer>
        <DrawerTrigger className="sm:hidden">
          <Bars3Icon className="size-6 text-neutral-400 hover:cursor-pointer hover:text-neutral-200" />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>menu</DrawerTitle>
          </DrawerHeader>
          <div className="mb-4 flex flex-col gap-2">
            <Button variant="ghost">
              <a href="https://forms.gle/vu921rkvr5Xpkraz8" target="_blank">
                give feedback
              </a>
            </Button>
            <RequestApiAccessBtn />
            <Button variant="ghost">
              <a href="mailto:contact@pixa.dev" target="_blank">
                contact us
              </a>
            </Button>
            {/* <SignedIn>
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
            </SignedOut> */}
          </div>
        </DrawerContent>
      </Drawer>

      {/* desktop menu */}
      <div className="hidden items-center gap-1 sm:flex sm:gap-4">
        <a href="https://forms.gle/vu921rkvr5Xpkraz8" target="_blank">
          <Button variant="ghost">give feedback</Button>
        </a>
        <RequestApiAccessBtn />
        <a href="mailto:contact@pixa.dev" target="_blank">
          <Button variant="ghost">contact us</Button>
        </a>
        {/* <SignedIn>
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
        </SignedOut> */}
      </div>
    </div>
  );
}
