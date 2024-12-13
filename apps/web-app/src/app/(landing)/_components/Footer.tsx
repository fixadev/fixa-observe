import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <div className="dark bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:flex lg:items-center lg:justify-between lg:px-8 lg:py-16">
        <h2 className="text-3xl font-extrabold lowercase tracking-tight text-white sm:text-4xl">
          <span className="block">ready to improve your voice agents?</span>
          <span className="block text-gray-400">
            start testing and fixing today
          </span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <Button size="lg">get started</Button>
        </div>
      </div>
    </div>
  );
}
