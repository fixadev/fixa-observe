"use client";

import { api } from "~/trpc/react";
import SavedSearchPage from "./saved/[searchId]/_components/SavedSearchPage";
import Spinner from "~/components/Spinner";
import { notFound } from "next/navigation";

export default function ObservePage() {
  const { data: defaultSavedSearch, isLoading } =
    api.search.getDefault.useQuery();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

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
