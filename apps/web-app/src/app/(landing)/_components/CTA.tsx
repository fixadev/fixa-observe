import { Button } from "~/components/ui/button";

export function CTA() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-8 px-4 py-12 pb-32 sm:px-6 lg:px-8 lg:py-16 lg:pb-32">
      <h2 className="text-3xl font-extrabold lowercase tracking-tight sm:text-4xl">
        <span className="block text-center">
          ready to improve your voice agents?
        </span>
        {/* <span className="block text-muted-foreground">
            start testing and fixing today
          </span> */}
      </h2>
      <Button size="lg">get started</Button>
    </div>
  );
}
