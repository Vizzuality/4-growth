"use client";

import { FC, useEffect, useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useAtom } from "jotai/react";
import { useSession } from "next-auth/react";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { cn } from "@/lib/utils";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationFirstPage,
  PaginationLastPage,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";

import { selectedRowAtom } from "../../store";

import useColumns from "./columns";

import { getAuthHeader } from "@/utils/auth-header";

const ROWS_PER_PAGE_OPTIONS = ["10", "25", "50", "100"];

const SavedVisualizationsTable: FC = () => {
  const columns = useColumns();
  const { data: session } = useSession();
  const [selectedRow] = useAtom(selectedRowAtom);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    size: Number(ROWS_PER_PAGE_OPTIONS[0]),
    totalPages: 1,
  });

  const { data } = client.users.getUsersCustomCharts.useQuery(
    queryKeys.users.userCharts(session?.user.id as string, {
      sorting,
      pagination,
    }).queryKey,
    {
      params: {
        id: session?.user.id as string,
      },
      extraHeaders: {
        ...getAuthHeader(session?.accessToken as string),
      },
      query: {
        fields: ["id", "name", "indicator", "type", "updatedAt"],
        sort: Object.keys(sorting).length
          ? sorting.map((sort) => `${sort.desc ? "" : "-"}${sort.id}`)
          : ["-updatedAt"],
        pageSize: pagination.size,
        pageNumber: pagination.page,
      },
    },
    {
      select: (data) => data.body,
      keepPreviousData: true,
    },
  );

  const table = useReactTable({
    columns,
    data: data?.data ? data.data : [],
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    manualPagination: true,
  });

  useEffect(() => {
    if (data?.metadata) {
      setPagination((pagination) => ({
        ...pagination,
        ...data.metadata,
      }));
    }
  }, [data]);

  if (!data?.data?.length) return;

  return (
    <>
      <ScrollArea className="h-full">
        <table className="w-full">
          <thead className="sticky top-0 bg-navy-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cn("pb-3 text-left", {
                      "pl-8": header.column.id === "name",
                    })}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-bluish-gray-500/35 text-sm">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={cn("border-l !border-l-transparent", {
                  "!border-l-foreground bg-navy-700":
                    selectedRow === row.original.id,
                })}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cn("py-3", {
                      "pl-8": cell.column.id === "name",
                    })}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
      <div className="sticky bottom-0 grid grid-cols-12 bg-navy-900 px-6">
        <div className="col-span-6 flex items-center">
          {/* <span className="text-sm text-slate-300">
            1 of 100 row(s) selected.
          </span> */}
        </div>
        <div className="col-span-6 flex items-center justify-between space-x-8">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Rows per page</span>
            <Select
              onValueChange={(value) => {
                setPagination({
                  ...pagination,
                  size: Number(value),
                });
              }}
            >
              <SelectTrigger className="w-auto space-x-2 rounded-3xl border-none bg-navy-700 px-4 py-[6px] hover:bg-navy-800">
                <SelectValue placeholder={ROWS_PER_PAGE_OPTIONS[0]} />
              </SelectTrigger>
              <SelectContent>
                {ROWS_PER_PAGE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Pagination className="w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationFirstPage
                  disabled={pagination.page === 1}
                  onClick={() => {
                    setPagination({
                      ...pagination,
                      page: 1,
                    });
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationPrevious
                  disabled={pagination.page - 1 === 0}
                  onClick={() => {
                    setPagination({
                      ...pagination,
                      page: pagination.page - 1,
                    });
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => {
                    setPagination({
                      ...pagination,
                      page: pagination.page + 1,
                    });
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLastPage
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => {
                    setPagination({
                      ...pagination,
                      page: pagination.totalPages,
                    });
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  );
};

export default SavedVisualizationsTable;
