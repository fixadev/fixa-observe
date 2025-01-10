export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const path = slug ? slug.join("/") : "";

  // Directly return the observe page component
  return (
    <iframe
      src={`/observe/${path}?demo=true`}
      className="h-screen w-full border-none"
    />
  );
}
