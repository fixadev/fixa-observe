import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading } from "./text/heading";
import { Title } from "./text/title";

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
          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
            <h3 className="text-2xl font-bold lowercase text-black">
              pay as you go
            </h3>
            <p className="mt-4 lowercase text-gray-500">
              perfect for teams just getting started
            </p>
            <p className="mt-8">
              <span className="text-4xl font-extrabold text-black">$0.20</span>
              <span className="ml-2 text-gray-500">/minute</span>
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "no minimum commitment",
                "pay only for what you use",
                "full feature access",
                "24/7 support",
              ].map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="mr-3 h-5 w-5 text-black" />
                  <span className="lowercase text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="mt-8 w-full lowercase">get started</Button>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
            <h3 className="text-2xl font-bold lowercase text-black">
              enterprise
            </h3>
            <p className="mt-4 lowercase text-gray-500">
              for organizations with custom needs
            </p>
            <p className="mt-8">
              <span className="text-4xl font-extrabold lowercase text-black">
                contact us
              </span>
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "custom pricing",
                "volume discounts",
                "dedicated support team",
                "custom sla",
                "advanced analytics",
                "priority feature access",
              ].map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="mr-3 h-5 w-5 text-black" />
                  <span className="lowercase text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            <Button variant="secondary" className="mt-8 w-full lowercase">
              contact sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
