import dynamic from "next/dynamic";

export default function Page({ params }: { params: { slug?: string[] } }) {
  const { slug } = params;
  const path = slug ? slug.join("/") : "";

  // Use dynamic import based on path
  if (path) {
    if (slug && slug.length >= 2 && slug[0] === "saved") {
      const searchId = slug[1]!;
      const Component = dynamic(
        () => import(`../../observe/saved/[searchId]/page`),
        {
          loading: () => <div>Loading...</div>,
        },
      );
      return <Component params={{ searchId }} />;
    } else {
      const Component = dynamic(() => import(`../../observe/${path}/page`), {
        loading: () => <div>Loading...</div>,
      });
      return <Component />;
    }
  }

  const Component = dynamic(() => import(`../../observe/page`), {
    loading: () => <div>Loading...</div>,
  });
  return <Component />;
}
