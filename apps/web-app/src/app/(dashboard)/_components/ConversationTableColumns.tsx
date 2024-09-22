"use client";

import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { type Conversation } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "~/components/DataTableColumnHeader";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export const columns: ColumnDef<Conversation>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="id"
          enableMultiSort={true}
        />
      );
    },
  },
  {
    accessorKey: "outcome",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="outcome"
          enableMultiSort={true}
        />
      );
    },
  },
  {
    accessorKey: "successProbability",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="success probability"
          enableMultiSort={true}
        />
      );
    },
  },
  {
    accessorKey: "audioFileUrl",
    header: "audio file",
  },
  {
    accessorKey: "transcriptUrl",
    header: "transcript",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="created at"
          enableMultiSort={true}
        />
      );
    },
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return (
        <span>
          {createdAt.toLocaleDateString()} {createdAt.toLocaleTimeString()}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const conversation = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <EllipsisHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(conversation.id)}
            >
              Copy conversation ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
