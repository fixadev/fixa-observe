"use client";

import { OrganizationSwitcher } from "@clerk/nextjs";
import { CreditCardIcon } from "@heroicons/react/24/solid";
import { BillingPage } from "~/components/BillingPage";

export function CustomOrganizationSwitcher() {
  return (
    <OrganizationSwitcher
      hidePersonal
      hideSlug
      afterCreateOrganizationUrl={
        typeof window !== "undefined" ? window.location.href : "/"
      }
      afterLeaveOrganizationUrl={
        "/org-selection?redirectUrl=" +
        (typeof window !== "undefined" ? window.location.href : "/")
      }
    >
      <OrganizationSwitcher.OrganizationProfilePage
        label="billing"
        labelIcon={<CreditCardIcon />}
        url="billing"
      >
        <BillingPage />
      </OrganizationSwitcher.OrganizationProfilePage>
    </OrganizationSwitcher>
  );
}
