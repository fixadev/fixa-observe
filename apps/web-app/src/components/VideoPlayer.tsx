export function VideoPlayer({ imageSrc }: { imageSrc: string | null }) {
  return (
    <div className="flex flex-col items-center justify-center">
      {imageSrc ? (
        <img src={imageSrc} alt="Manim animation" />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
