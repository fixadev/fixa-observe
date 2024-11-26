import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

export default function CallLatencyCard() {
  return (
    <div className="flex items-center gap-2 border-b border-border bg-background p-2 hover:bg-muted/50">
      <Image
        className="size-[32px] shrink-0 rounded-full"
        src="/images/agent-avatars/jordan.png"
        alt="Jordan"
        width={32}
        height={32}
      />
      <div className="flex flex-col gap-1">
        <div className="text-sm font-medium">airtable inbound</div>
        <div className="text-xs text-muted-foreground">
          call.2mLTbvbnQZ785c96meHH1p
        </div>
      </div>
      <div className="flex flex-1 justify-center gap-4">
        <div className="font-medium text-green-500">700ms</div>
        <div className="font-medium text-muted-foreground">800ms</div>
        <div className="font-medium text-red-500">5000ms</div>
      </div>
      <div className="text-xs text-muted-foreground">
        {formatDistanceToNow(new Date(1716268800000), { addSuffix: true })}
      </div>
    </div>
  );
}
