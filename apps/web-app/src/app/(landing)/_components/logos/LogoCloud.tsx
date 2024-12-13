import React from "react";
import { LogoCloudTitle } from "./LogoCloudTitle";
import { CustomerLogo } from "./CustomerLogo";

export function LogoCloud() {
  const customers = [
    { logo: "/images/landing-page/customer-logos/11x.png" },
    { logo: "/images/landing-page/customer-logos/ofone.png" },
  ];

  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <LogoCloudTitle />
        <div className="/md:grid-cols-3 /lg:grid-cols-6 mx-auto mt-8 grid max-w-xl shrink-0 grid-cols-2 justify-center justify-items-center gap-8">
          {customers.map((customer, i) => (
            <CustomerLogo key={i} {...customer} />
          ))}
        </div>
      </div>
    </div>
  );
}
