import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading } from "./text/heading";
import { Title } from "./text/title";
import Link from "next/link";

export function Pricing() {
  return (
    <div id="pricing" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 lg:text-center">
          <Heading>pricing</Heading>
          <Title className="mt-2">simple, transparent pricing</Title>
          <p className="mt-4 max-w-2xl text-xl lowercase text-gray-500 lg:mx-auto">
            choose the plan that best fits your needs
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
            <h3 className="text-2xl font-bold lowercase text-black">
              pay as you go
            </h3>
            <p className="mt-4 lowercase text-gray-500">
              perfect for teams just getting started
            </p>
            <div className="mt-8 flex flex-col gap-8 sm:h-16 sm:flex-row sm:items-center">
              <div className="flex flex-col gap-2">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  TESTING
                </div>
                <div className="flex items-baseline">
                  <div className="text-4xl font-extrabold text-black">
                    $0.20
                  </div>
                  <div className="ml-2 text-gray-500">/minute</div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  OBSERVABILITY
                </div>
                <div className="flex items-baseline">
                  <div className="text-4xl font-extrabold text-black">
                    $0.025
                  </div>
                  <div className="ml-2 text-gray-500">/minute</div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <ul className="space-y-4">
                {[
                  "no minimum commitment",
                  "pay only for what you use",
                  "full feature access",
                  "slack support",
                ].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="mr-3 h-5 w-5 text-black" />
                    <span className="lowercase text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1" />
            <Button className="mt-8 w-full lowercase">get started</Button>
          </div>

          <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
            <h3 className="text-2xl font-bold lowercase text-black">
              enterprise
            </h3>
            <p className="mt-4 lowercase text-gray-500">
              for organizations with custom needs
            </p>
            <div className="mt-8 sm:flex sm:h-16 sm:items-center">
              <div className="flex flex-col gap-2">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  TESTING & OBSERVABILITY
                </div>
                <div className="text-4xl font-extrabold lowercase text-black">
                  contact us
                </div>
              </div>
            </div>
            <div className="mt-8">
              <div className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                everything in &quot;pay as you go&quot; plus:
              </div>
              <ul className="space-y-4">
                {[
                  "volume discounts",
                  "custom integrations",
                  "priority feature access",
                  "SOC 2 & HIPAA compliance",
                ].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="mr-3 h-5 w-5 text-black" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1" />
            <Button variant="outline" className="mt-8 w-full lowercase" asChild>
              <Link
                href="https://cal.com/team/fixa/enterprise-pricing"
                target="_blank"
              >
                contact us
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
