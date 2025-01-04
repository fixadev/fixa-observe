import { OrganizationSwitcher } from "@clerk/nextjs";
import { CreditCardIcon } from "@heroicons/react/24/solid";
import { BillingPage } from "~/components/BillingPage";

export function CustomOrganizationSwitcher() {
  return (
    <OrganizationSwitcher
      hidePersonal
      hideSlug
      afterCreateOrganizationUrl={window.location.href}
      afterLeaveOrganizationUrl={
        "/org-selection?redirectUrl=" + window.location.href
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
