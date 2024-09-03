import LandingPageBody from "@/app/_components/LandingPageBody";
import Logo from "@/components/Logo";

export default async function Home() {
  return (
    <div className="bg-neutral-900">
      <Logo />
      <LandingPageBody />
    </div>
  );
}
