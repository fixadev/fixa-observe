export function VideoPlayer({
  imageSrc,
  className,
}: {
  imageSrc: string | null;
  className?: string;
}) {
  return (
    <div
      className={`flex aspect-video w-full max-w-screen-md flex-col items-center justify-center rounded-lg ${className}`}
    >
      {imageSrc ? (
        <img src={imageSrc} alt="Manim animation" />
      ) : (
        <div className="h-full w-full rounded-lg bg-black"></div>
      )}
    </div>
  );
}
