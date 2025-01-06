"use client";

import { OrganizationSwitcher } from "@clerk/nextjs";
import { CreditCardIcon } from "@heroicons/react/24/solid";
import { BillingPage } from "~/components/BillingPage";
import { useFeatureFlagEnabled } from "posthog-js/react";

export function CustomOrganizationSwitcher() {
  const bypassPayment = useFeatureFlagEnabled("bypass-payment");

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
      {!bypassPayment && (
        <OrganizationSwitcher.OrganizationProfilePage
          label="billing"
          labelIcon={<CreditCardIcon />}
          url="billing"
        >
          <BillingPage />
        </OrganizationSwitcher.OrganizationProfilePage>
      )}
    </OrganizationSwitcher>
  );
}
