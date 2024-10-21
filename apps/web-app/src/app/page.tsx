"use client";

import { Button } from "~/components/ui/button";
import TopBar from "./_components/TopBar";
import { CheckCircleIcon, MinusCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import RequestAccessDialog from "./_components/RequestAccessDialog";
import Link from "next/link";

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
          "Apex helps you draft emails to verify property data. Emails are categorized based on whether a follow-up is needed.",
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

  const scrollToHowItWorks = useCallback(() => {
    const howItWorksSection = document.getElementById("how-it-works");
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const [requestAccessDialogOpen, setRequestAccessDialogOpen] = useState(false);

  return (
    <>
      <TopBar />
      <div className="pb-16 pt-32 lg:h-screen lg:py-16 lg:pl-8">
        <div className="container mx-auto h-full">
          <div className="relative flex h-full w-full flex-col items-center justify-center gap-8 lg:flex-row">
            <div className="z-20 flex max-w-[270px] flex-col items-center gap-4 sm:max-w-[unset] sm:gap-8 lg:items-start">
              <div className="flex shrink-0 flex-col gap-1 text-center text-2xl font-medium sm:text-4xl md:gap-4 md:text-4xl lg:text-left lg:text-5xl">
                <div>Property surveys,</div>
                <div>without the busywork</div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button
                  size="lg"
                  onClick={() => setRequestAccessDialogOpen(true)}
                >
                  Request access
                </Button>
                <Button size="lg" variant="ghost" onClick={scrollToHowItWorks}>
                  How it works
                </Button>
                {/* <Button
                  size="lg"
                  variant="ghost"
                  className="flex items-center gap-2"
                >
                  <PlayCircleIcon className="size-5" /> Watch video
                </Button> */}
              </div>
            </div>
            {/* <div className="absolute left-0 z-10 hidden h-full w-full bg-gradient-to-r from-white from-30% to-transparent to-50% lg:block"></div> */}
            <div className="rounded-md border border-input shadow-sm lg:flex-1">
              <Image
                className="rounded-md"
                src="/images/landing-page/hero-image.png"
                alt="Hero image"
                // fill
                width={925}
                height={760}
              />
            </div>
          </div>
        </div>
        <div id="how-it-works" />
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
            <div className="mb-4 text-lg">
              It takes{" "}
              <span className="font-medium underline decoration-2 underline-offset-4">
                4.5 hours
              </span>{" "}
              to create a property survey
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
                information from brochures
              </ProConCard>
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-4 flex items-center gap-2 text-3xl font-medium">
              With{" "}
              <Image src="/images/logo.png" alt="Apex" width={30} height={30} />{" "}
              Apex
            </div>
            <div className="mb-4 text-lg">
              It takes{" "}
              <span className="font-medium underline decoration-2 underline-offset-4">
                15 minutes
              </span>{" "}
              to create a property survey
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
      <div className="pb-16">
        <div className="container mx-auto flex flex-col items-center gap-4">
          <div className="text-center text-xl font-medium sm:text-3xl">
            Minimize manual work.
          </div>
          <div className="mb-4 text-center text-xl font-medium sm:text-3xl">
            Maximize client relationships.
          </div>
          <Button size="lg" onClick={() => setRequestAccessDialogOpen(true)}>
            Request access
          </Button>
        </div>
      </div>
      <div className="dark bg-background py-16 text-foreground">
        <div className="container mx-auto flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-center gap-4 sm:items-start">
            <div className="flex items-center gap-2">
              <Image src="/images/logo.png" alt="Apex" width={30} height={30} />
              <div className="text-2xl font-medium">Apex</div>
            </div>
            <div className="text-center text-xl sm:text-left">
              Property surveys, <br />
              without the busywork
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Button onClick={() => setRequestAccessDialogOpen(true)}>
              Request access
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" asChild>
                <Link href="mailto:contact@apex.deal" target="_blank">
                  Contact
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link
                  href="https://www.linkedin.com/company/apex-deal"
                  target="_blank"
                >
                  <LinkedInLogoIcon className="size-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <RequestAccessDialog
        open={requestAccessDialogOpen}
        onOpenChange={() => setRequestAccessDialogOpen(false)}
      />
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
        <CheckCircleIcon className="size-4 shrink-0 text-green-500 sm:size-5" />
      ) : (
        <MinusCircleIcon className="size-4 shrink-0 text-red-500 sm:size-5" />
      )}
      <span className="text-sm sm:text-base">{children}</span>
    </div>
  );
}
