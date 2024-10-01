import { Card, CardHeader, CardTitle } from "~/components/ui/card";

export default function AttachmentCard() {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-l-xl bg-gray-100"></div>
        <CardHeader className="p-0">
          <CardTitle>Attachment</CardTitle>
        </CardHeader>
      </div>
    </Card>
  );
}
