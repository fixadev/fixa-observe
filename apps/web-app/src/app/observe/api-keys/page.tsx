"use client";

import { useEffect } from "react";
import { CopyText } from "~/components/CopyText";
import { Label } from "~/components/ui/label";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";

export default function ApiKeysPage() {
  const { data: apiKey, refetch, isLoading } = api.user.getApiKey.useQuery();
  const { mutateAsync: generateApiKey, isPending: isGeneratingApiKey } =
    api.user.generateApiKey.useMutation();

  useEffect(() => {
    const generateKey = async () => {
      await generateApiKey();
      await refetch();
    };

    if (!apiKey?.apiKey && !isLoading) {
      void generateKey();
    }
  }, [generateApiKey, apiKey, refetch, isLoading]);

  return (
    <div>
      <div className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-input bg-sidebar px-4 lg:h-[60px]">
        <div className="flex flex-1 items-center gap-2">
          <SidebarTrigger />
          <div className="font-medium">API keys</div>
        </div>
      </div>
      <div className="container flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-2">
          <Label>API key</Label>
          {isGeneratingApiKey || isLoading ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <CopyText text={apiKey?.apiKey ?? ""} sensitive />
          )}
        </div>
      </div>
    </div>
  );
}
