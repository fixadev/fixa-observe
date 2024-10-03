import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";

export default function EmailCard() {
  return (
    <Card className="flex-1 overflow-hidden">
      <CardHeader className="overflow-hidden">
        <div className="flex items-center gap-2 overflow-hidden">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="space-y-1.5 overflow-hidden">
            <CardTitle>You</CardTitle>
            <CardDescription className="overflow-hidden truncate">
              Dear Mark, I hope this email finds you well. I&apos;m reaching out
              regarding the property at 123 Main St. that I recently came across
              in my search for potential investments. I&apos;m very interested
              in this property and would appreciate if you could provide me with
              some additional information: 1. What is the current asking price
              for the property? 2. Is the property still available on the
              market? 3. Could you share any recent updates or renovations that
              have been made to the property? 4. Are there any known issues or
              repairs that might be needed? 5. What are the annual property
              taxes and any HOA fees, if applicable? Additionally, I was
              wondering if it would be possible to schedule a viewing of the
              property sometime next week. I&apos;m particularly available on
              Tuesday afternoon or Thursday morning if either of those times
              work for you. Thank you for your time and assistance. I look
              forward to hearing back from you soon. Best regards, Colin
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
