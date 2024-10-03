import TopBar from "./_components/TopBar";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopBar />
      <div className="container mx-auto pt-32">{children}</div>
    </>
  );
}
