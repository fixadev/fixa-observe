"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  ChartBarIcon,
  ChevronDownIcon,
  CreditCardIcon,
  DocumentIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { removeTrailingSlash } from "~/lib/utils";
import Logo from "../Logo";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { type SavedSearchWithIncludes } from "@repo/types/src";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import Spinner from "../Spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { UserButton } from "@clerk/nextjs";

export default function ObserveSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isCurrentPath = useCallback(
    (path: string) => {
      if (path === "/") {
        return removeTrailingSlash(pathname) === `/observe`;
      }
      return (
        removeTrailingSlash(pathname) === removeTrailingSlash(`/observe${path}`)
      );
    },
    [pathname],
  );

  const { data: savedSearches } = api.search.getAll.useQuery();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [curSavedSearch, setCurSavedSearch] =
    useState<SavedSearchWithIncludes | null>(null);

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="-m-2 flex h-14 items-center justify-between border-b px-4 lg:h-[60px]">
            <Select
              onValueChange={(value) => {
                if (value === "test") {
                  router.push(`/dashboard/new`);
                }
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="observe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="test">test</SelectItem>
                <SelectItem value="observe">observe</SelectItem>
              </SelectContent>
            </Select>
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Link
                  href="/billing"
                  label="billing"
                  labelIcon={<CreditCardIcon />}
                />
                <UserButton.Action label="manageAccount" />
                <UserButton.Action label="signOut" />
              </UserButton.MenuItems>
            </UserButton>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isCurrentPath("/")}>
                    <Link href={`/observe`}>
                      <ChartBarIcon />
                      <span>dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <Collapsible defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton isActive={isCurrentPath("/saved")}>
                        <DocumentIcon className="h-4 w-4" />
                        <span>saved searches</span>
                        <div className="flex-1" />
                        <ChevronDownIcon className="h-4 w-4 transition-transform duration-200 group-data-[state=closed]/collapsible:rotate-[-90deg]" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {savedSearches?.map((search) => (
                          <SidebarMenuSubItem key={search.id}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isCurrentPath(`/saved/${search.id}`)}
                              className="group/saved-search-item relative data-[active=true]:font-medium"
                            >
                              <Link href={`/observe/saved/${search.id}`}>
                                {search.name}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="absolute right-0 size-6 text-muted-foreground opacity-0 duration-200 hover:bg-gray-200 group-hover/saved-search-item:opacity-100 data-[state=open]:bg-gray-200 data-[state=open]:opacity-100"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <EllipsisHorizontalIcon className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setCurSavedSearch(search);
                                        setRenameDialogOpen(true);
                                      }}
                                    >
                                      rename
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setCurSavedSearch(search);
                                        setDeleteDialogOpen(true);
                                      }}
                                    >
                                      delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <RenameDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        savedSearch={curSavedSearch}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        savedSearch={curSavedSearch}
      />
    </>
  );
}

function RenameDialog({
  open,
  onOpenChange,
  savedSearch,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savedSearch: SavedSearchWithIncludes | null;
}) {
  const utils = api.useUtils();
  const { mutate: updateSavedSearch, isPending } =
    api.search.update.useMutation({
      onSuccess: () => {
        onOpenChange(false);
        void utils.search.getAll.invalidate();
      },
    });
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (savedSearch) {
      setNewName(savedSearch.name);
    }
  }, [savedSearch]);

  const handleRename = useCallback(() => {
    if (savedSearch) {
      updateSavedSearch({ ...savedSearch, name: newName });
    }
  }, [savedSearch, newName, updateSavedSearch]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>rename saved search</DialogTitle>
        </DialogHeader>
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder={savedSearch?.name}
          autoFocus
          onFocus={(e) => e.target.select()}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleRename();
            }
          }}
        />
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            cancel
          </Button>
          <Button onClick={handleRename} disabled={isPending}>
            {isPending ? <Spinner className="size-4" /> : "rename"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteDialog({
  open,
  onOpenChange,
  savedSearch,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savedSearch: SavedSearchWithIncludes | null;
}) {
  const pathname = usePathname();
  const utils = api.useUtils();
  const router = useRouter();

  const { mutate: deleteSavedSearch, isPending } =
    api.search.delete.useMutation({
      onSuccess: () => {
        onOpenChange(false);
        void utils.search.getAll.invalidate();

        const currentPathId = pathname.split("/").pop();
        if (currentPathId === savedSearch?.id) {
          router.push("/observe");
        }
      },
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>are you sure?</DialogTitle>
          <DialogDescription>
            are you sure you want to delete &quot;{savedSearch?.name}&quot;?
            this action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            cancel
          </Button>
          <Button
            onClick={() => {
              if (savedSearch) {
                deleteSavedSearch({ id: savedSearch.id });
              }
            }}
            disabled={isPending}
          >
            {isPending ? <Spinner className="size-4" /> : "delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
