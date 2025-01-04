import { OrganizationSwitcher } from "@clerk/nextjs";
import { CreditCardIcon } from "@heroicons/react/24/solid";
import { BillingPage } from "~/components/BillingPage";

export function CustomOrganizationSwitcher() {
  return (
    <OrganizationSwitcher hidePersonal hideSlug>
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
