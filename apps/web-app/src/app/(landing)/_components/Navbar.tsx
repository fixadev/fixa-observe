"use client";

import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import Logo from "~/components/Logo";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";
import { SignedOut } from "@clerk/nextjs";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";

const navLinks = [
  {
    href: "https://docs.fixa.dev/fixa-observe",
    label: "docs",
    isLink: true,
    target: "_blank",
  },
  { href: "#features", label: "features" },
  { href: "#pricing", label: "pricing" },
  // { href: "#contact", label: "contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, href: string) => {
      e.preventDefault();
      setIsOpen(false);

      // Get the target element
      const target = document.querySelector(href);
      if (target) {
        // Add a small delay to ensure proper execution
        setTimeout(() => {
          const navbarHeight = 64; // height of your navbar (16 * 4 = 64px)
          const targetPosition = target.getBoundingClientRect().top;
          const offsetPosition =
            targetPosition + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });

          // Update URL after scrolling is complete
          setTimeout(() => {
            window.history.pushState({}, "", href);
          }, 100);
        }, 0);
      }
    },
    [],
  );

  return (
    <nav className="fixed z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-sm">
      <div className="dark bg-background text-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-2 py-4 sm:flex-row sm:gap-0">
            <div className="text-center text-xs sm:text-sm">
              we just launched an open source voice agent testing package!
            </div>
            <Button variant="link" asChild className="h-fit py-0">
              <Link
                href="https://github.com/fixadev/fixa"
                target="_blank"
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                check it out
                <ArrowTopRightOnSquareIcon className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logo />

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navLinks.map((link) => {
                if (link.isLink) {
                  return (
                    <Button variant="ghost" key={link.href} asChild>
                      <Link href={link.href} target={link.target}>
                        {link.label}
                      </Link>
                    </Button>
                  );
                }
                return (
                  <Button
                    variant="ghost"
                    key={link.href}
                    onClick={(e) => handleScroll(e, link.href)}
                  >
                    {link.label}
                  </Button>
                );
              })}
              <SignedOut>
                <Button asChild>
                  <Link href="/sign-up">get started</Link>
                </Button>
              </SignedOut>
              <SignedIn>
                <Button asChild>
                  <Link href="/observe">dashboard</Link>
                </Button>
              </SignedIn>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-black"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-gray-100 md:hidden"
          >
            <div className="space-y-1 bg-white px-2 pb-3 pt-2 sm:px-3">
              {navLinks.map((link) => {
                if (link.isLink) {
                  return (
                    <Button
                      className="w-full"
                      variant="ghost"
                      key={link.href}
                      asChild
                    >
                      <Link href={link.href} target={link.target}>
                        {link.label}
                      </Link>
                    </Button>
                  );
                }
                return (
                  <Button
                    className="w-full"
                    variant="ghost"
                    key={link.href}
                    onClick={(e) => handleScroll(e, link.href)}
                  >
                    {link.label}
                  </Button>
                );
              })}
              <SignedOut>
                <Button className="w-full" asChild>
                  <Link href="/sign-up">get started</Link>
                </Button>
              </SignedOut>
              <SignedIn>
                <Button className="w-full" asChild>
                  <Link href="/dashboard">dashboard</Link>
                </Button>
              </SignedIn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
