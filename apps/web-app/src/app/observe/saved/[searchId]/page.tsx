"use client";

import { api } from "~/trpc/react";
import SavedSearchPage from "./_components/SavedSearchPage";
import Spinner from "~/components/Spinner";
import { notFound } from "next/navigation";

export default function Page({ params }: { params: { searchId: string } }) {
  const { data: savedSearch, isLoading } = api.search.getById.useQuery({
    id: params.searchId,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!savedSearch) {
    notFound();
  }

  return <SavedSearchPage params={params} savedSearch={savedSearch} />;
}
