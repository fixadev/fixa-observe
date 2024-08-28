import Link from "next/link";
import SplashPage from "@/components/splash";
import Logo from "@/components/Logo";

export default async function Home() {
  return (
    <div>
      <Logo />
      <SplashPage />
    </div>
  );
}
