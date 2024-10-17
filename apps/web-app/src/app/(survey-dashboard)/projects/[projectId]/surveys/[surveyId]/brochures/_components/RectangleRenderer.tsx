import { brochureRectangles } from "@/lib/property";
import { type JsonValue } from "@prisma/client/runtime/library";
import Image from "next/image";

export function RectangleRenderer({
  rectangles,
  pageNumber,
}: {
  rectangles?: JsonValue | undefined;
  pageNumber: number;
}) {
  if (!rectangles) return null;

  const parsedRectangles = brochureRectangles.safeParse(rectangles);

  if (!parsedRectangles.success) {
    console.error("Failed to parse rectangles", parsedRectangles.error);
    return null;
  }

  const currentPageRectangles = parsedRectangles.data.filter(
    (r) => r.pageNumber === pageNumber,
  );

  return (
    <div className="pointer-events-none absolute z-30 flex h-full w-full cursor-crosshair items-center justify-center bg-transparent">
      {currentPageRectangles.map((rect, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: `${rect.x * 100}%`,
            top: `${rect.y * 100}%`,
            width: `${rect.width * 100}%`,
            height: `${rect.height * 100}%`,
          }}
        >
          <Image
            src={rect.imageUrl ?? ""}
            alt="Rectangle"
            fill
            className="absolute left-0 top-0 h-full w-full"
          />
        </div>
      ))}
    </div>
  );
}
