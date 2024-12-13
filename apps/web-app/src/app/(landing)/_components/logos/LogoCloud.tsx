import React from "react";
import { LogoCloudTitle } from "./LogoCloudTitle";
import { CustomerLogo } from "./CustomerLogo";

export function LogoCloud() {
  const customers = [
    { name: "acme corp", grayscale: true },
    { name: "globex", grayscale: true },
    { name: "hooli", grayscale: true },
    { name: "pied piper", grayscale: true },
    { name: "stark industries", grayscale: true },
    { name: "wayne enterprises", grayscale: true },
  ];

  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <LogoCloudTitle />
        <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {customers.map((customer) => (
            <CustomerLogo key={customer.name} {...customer} />
          ))}
        </div>
      </div>
    </div>
  );
}
