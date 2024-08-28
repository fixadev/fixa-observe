'use client'
import Link from "next/link";
import { SplashPage } from "@/components/splash";
import { useTheme } from "next-themes"

export default async function Home() {
  const { setTheme } = useTheme()
  setTheme("dark")
  return (
      <SplashPage />
  );
}

