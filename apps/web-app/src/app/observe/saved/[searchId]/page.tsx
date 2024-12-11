import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import SavedSearchPage from "./_components/SavedSearchPage";

// TODO: refactor this to be cleaner

export default async function Page({
  params,
}: {
  params: { searchId: string };
}) {
  const savedSearch = await api.search.getById({
    id: params.searchId,
  });

  if (!savedSearch) {
    notFound();
  }

  return <SavedSearchPage params={params} savedSearch={savedSearch} />;
}
