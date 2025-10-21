"use client";

import { FC, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { CustomWidget } from "@shared/dto/widgets/custom-widget.entity";
import { SortQueryParam } from "@shared/schemas/query-param.schema";
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

import NoData from "@/containers/no-data";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationFirstPage,
  PaginationLastPage,
} from "@/components/ui/pagination";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { ScrollableTable, TableBody } from "@/components/ui/table";
import { getAuthHeader } from "@/utils/auth-header";
import { getDynamicRouteHref } from "@/utils/route-config";

import { selectedRowAtom } from "../../store";

import useColumns from "./columns";

const ROWS_PER_PAGE_OPTIONS = ["10", "25", "50", "100"];
export const DEFAULT_TABLE_OPTIONS = {
  sorting: [],
  pagination: {
    page: 1,
    size: Number(ROWS_PER_PAGE_OPTIONS[0]),
    totalPages: 1,
  },
};

const SavedVisualizationsTable: FC = () => {
  const columns = useColumns();
  const { data: session } = useSession();
  const [selectedRow] = useAtom(selectedRowAtom);
  const router = useRouter();

  const [sorting, setSorting] = useState<SortingState>(
    DEFAULT_TABLE_OPTIONS.sorting,
  );
  const [pagination, setPagination] = useState(
    DEFAULT_TABLE_OPTIONS.pagination,
  );

  const { data, isFetching } = client.users.searchCustomWidgets.useQuery(
    queryKeys.users.userCharts(session?.user.id as string, {
      sorting,
      pagination,
    }).queryKey,
    {
      params: {
        userId: session?.user.id as string,
      },
      extraHeaders: {
        ...getAuthHeader(session?.accessToken as string),
      },
      query: {
        include: ["widget"],
        sort: Object.keys(sorting).length
          ? (sorting.map(
              (sort) => `${sort.desc ? "" : "-"}${sort.id}`,
            ) as SortQueryParam<CustomWidget>)
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

  if (isFetching) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  if (!data?.data?.length)
    return <NoData description="No visualizations saved" />;

  return (
    <div className="relative flex h-full flex-1 flex-col overflow-hidden">
      <ScrollableTable>
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
        <TableBody className="divide-y divide-bluish-gray-500/35 text-sm">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={cn(
                "cursor-pointer border-l !border-l-transparent transition-colors hover:bg-navy-700",
                {
                  "!border-l-foreground bg-navy-700":
                    selectedRow === String(row.original.id),
                },
              )}
              onClick={() =>
                router.push(
                  getDynamicRouteHref(
                    "surveyAnalysis",
                    "sandbox",
                    String(row.original.id),
                  ),
                )
              }
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
        </TableBody>
      </ScrollableTable>
      <div className="sticky bottom-0 grid grid-cols-12 bg-navy-900 px-6">
        <div className="col-span-1 flex items-center xl:col-span-6">
          {/* <span className="text-sm text-slate-300">
            1 of 100 row(s) selected.
          </span> */}
        </div>
        <div className="col-span-12 flex items-center justify-between space-x-8 xl:col-span-6">
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
    </div>
  );
};

export default SavedVisualizationsTable;
