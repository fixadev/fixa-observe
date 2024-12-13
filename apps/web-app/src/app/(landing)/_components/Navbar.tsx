"use client";

import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Logo from "~/components/Logo";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "#features", label: "features" },
    { href: "#pricing", label: "pricing" },
    { href: "#contact", label: "contact" },
  ];

  return (
    <nav className="fixed z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Logo />

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navLinks.map((link) => (
                <Button variant="ghost" key={link.href} asChild>
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
              <Button>get started</Button>
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
              {navLinks.map((link) => (
                <Button
                  variant="ghost"
                  key={link.href}
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                  asChild
                >
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
              <Button className="w-full">get started</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
