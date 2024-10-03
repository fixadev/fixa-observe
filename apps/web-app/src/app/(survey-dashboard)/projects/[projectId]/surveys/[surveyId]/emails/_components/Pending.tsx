import { Separator } from "~/components/ui/separator";
import EmailCard from "./EmailCard";
import BuildingFacade from "./BuildingFacade";

export default function Pending() {
  return (
    <div className="space-y-10 pt-12">
      <EmailSection />
      <Separator />
      <EmailSection />
      <Separator />
      <EmailSection />
    </div>
  );
}

function EmailSection() {
  return (
    <div className="flex items-start gap-8 overflow-hidden">
      <BuildingFacade />
      <EmailCard />
    </div>
  );
}
