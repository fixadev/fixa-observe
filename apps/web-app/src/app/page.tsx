import { Button } from "~/components/ui/button";
import TopBar from "./_components/TopBar";
import {
  CheckCircleIcon,
  MinusCircleIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { useMemo } from "react";

export default function LandingPage() {
  const howItWorksItems = useMemo(() => {
    return [
      {
        image: "/images/landing-page/import-properties.png",
        title: "1. Import properties",
        description:
          "No more manual data entry. Import directly from your database.",
      },
      {
        image: "/images/landing-page/verify-data.png",
        title: "2. Verify data",
        description:
          "Apex drafts emails for you to save you time. Property data is automatically updated as responses come in.",
      },
      {
        image: "/images/landing-page/edit-brochures.png",
        title: "3. Edit brochures",
        description: "Quickly delete unnecessary information and remove logos.",
      },
      {
        image: "/images/landing-page/share.png",
        title: "4. Share survey",
        description:
          "Export as PDF or a shareable link to send to your clients.",
      },
    ];
  }, []);

  return (
    <>
      <TopBar />
      <div className="pb-16 pt-32 md:h-screen md:py-16 md:pl-8">
        <div className="container mx-auto h-full">
          <div className="flex h-full items-center gap-16">
            <div className="flex flex-col gap-8">
              <div className="text-4xl font-medium leading-tight md:text-5xl lg:text-7xl">
                Property surveys,
                <br />
                without the busywork
              </div>
              <div className="flex items-center gap-2">
                <Button size="lg">Request access</Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="flex items-center gap-2"
                >
                  <PlayCircleIcon className="size-5" /> Watch video
                </Button>
              </div>
            </div>
            <div>
              {/* <div className="h-[700px]" /> */}
              {/* <div className="size-[500px] rounded-xl bg-muted p-8"></div> */}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-muted py-16">
        <div className="container mx-auto flex flex-col items-center">
          <div className="mb-8 text-3xl font-medium">How it works</div>
          <div className="grid w-fit grid-cols-1 place-content-center gap-4 md:grid-cols-2 lg:grid-cols-4">
            {howItWorksItems.map((item, index) => (
              <HowItWorksCard key={index} {...item} />
            ))}
          </div>
        </div>
      </div>
      <div className="py-16">
        <div className="container mx-auto flex flex-col gap-8 lg:flex-row lg:gap-4">
          <div className="flex-1">
            <div className="mb-4 text-3xl font-medium">On average</div>
            <div className="mb-4">
              It takes 4.5 hours to create a property survey
            </div>
            <div className="flex flex-col gap-2">
              <ProConCard type="con">
                <span className="font-medium">Manually</span> copy pasting
                information from database
              </ProConCard>
              <ProConCard type="con">
                <span className="font-medium">Manually</span> emailing brokers
                for updated property data
              </ProConCard>
              <ProConCard type="con">
                <span className="font-medium">Manually</span> deleting
                information from brochures before sending to clients
              </ProConCard>
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-4 flex items-center gap-2 text-3xl font-medium">
              With{" "}
              <Image src="/images/logo.png" alt="Apex" width={30} height={30} />{" "}
              Apex
            </div>
            <div className="mb-4">
              It takes 15 minutes to create a property survey
            </div>
            <div className="flex flex-col gap-2">
              <ProConCard type="pro">
                <span className="font-medium">Automatic</span> PDF import
              </ProConCard>
              <ProConCard type="pro">
                <span className="font-medium">One-click</span> email sending and
                organization
              </ProConCard>
              <ProConCard type="pro">
                <span className="font-medium">Super simple</span> brochure
                editing
              </ProConCard>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-primary py-16">
        <div className="container mx-auto"></div>
      </div>
    </>
  );
}

type HowItWorksItem = {
  image: string;
  title: string;
  description: string;
};

function HowItWorksCard({ image, title, description }: HowItWorksItem) {
  return (
    <div className="max-w-[310px] rounded-md border border-input bg-background shadow-sm">
      <Image
        className="rounded-t-md"
        src={image}
        alt={title}
        width={400}
        height={300}
      />
      <div className="flex flex-col gap-2 p-4">
        <div className="text-xl font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
    </div>
  );
}

function ProConCard({
  children,
  type,
}: {
  children: React.ReactNode;
  type: "pro" | "con";
}) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-input p-4 shadow-sm">
      {type === "pro" ? (
        <CheckCircleIcon className="size-5 text-green-500" />
      ) : (
        <MinusCircleIcon className="size-5 text-red-500" />
      )}
      {children}
    </div>
  );
}
