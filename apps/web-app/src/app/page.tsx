import { Button } from "~/components/ui/button";
import TopBar from "./_components/TopBar";
import { PlayCircleIcon } from "@heroicons/react/24/solid";

export default function LandingPage() {
  return (
    <>
      <TopBar />
      <div className="px-8 py-16 pt-32">
        <div className="container mx-auto">
          <div className="flex items-center gap-16">
            <div className="flex flex-col gap-8">
              <div className="text-5xl font-bold leading-tight">
                Property surveys,
                <br />
                without the busywork
              </div>
              <div className="flex items-center gap-2">
                <Button>Request access</Button>
                <Button variant="ghost" className="flex items-center gap-2">
                  <PlayCircleIcon className="size-5" /> Watch video
                </Button>
              </div>
            </div>
            <div>
              <div className="size-[500px] rounded-xl bg-muted p-8"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-muted px-8 py-16">
        <div className="container mx-auto">
          <div className="text-3xl font-medium">How it works</div>
        </div>
      </div>
    </>
  );
}
