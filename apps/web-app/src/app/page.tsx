import SplashPage from "@/components/Splash";
import Logo from "@/components/Logo";

export default async function Home() {
  return (
    <div className="bg-neutral-900">
      <Logo />
      <SplashPage />
    </div>
  );
}
