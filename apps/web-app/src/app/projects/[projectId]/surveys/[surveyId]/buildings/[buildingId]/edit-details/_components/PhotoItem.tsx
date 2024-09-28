import { TrashIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { Button } from "~/components/ui/button";

export default function PhotoItem({
  src,
  width,
  height,
}: {
  src: string;
  width?: number;
  height?: number;
}) {
  return (
    <div className="group relative">
      <Image src={src} alt="Photo" width={width} height={height} />
      <Button
        size="icon"
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100"
      >
        <TrashIcon className="size-4" />
      </Button>
    </div>
  );
}
