import SavedSearchPage from "./saved/[searchId]/_components/SavedSearchPage";
import { api } from "~/trpc/server";
import { notFound } from "next/navigation";

export default async function ObservePage() {
  const defaultSavedSearch = await api.search.getDefault();

  if (!defaultSavedSearch) {
    notFound();
  }

  return (
    <SavedSearchPage
      params={{ searchId: defaultSavedSearch.id }}
      savedSearch={defaultSavedSearch}
    />
  );
}
