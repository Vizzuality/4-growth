"use client";

import { FC, useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { CustomWidget } from "@shared/dto/widgets/custom-widget.entity";
import { WIDGET_VISUALIZATIONS } from "@shared/dto/widgets/widget-visualizations.constants";
import { SavedProjection } from "@shared/dto/projections/saved-projection.entity";
import { CHART_INDICATORS } from "@shared/dto/projections/custom-projection-settings";
import { CustomProjectionSettingsSchemaType } from "@shared/schemas/custom-projection-settings.schema";
import { SortQueryParam } from "@shared/schemas/query-param.schema";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
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

import useColumns, { SavedVisualizationRow } from "./columns";

const ROWS_PER_PAGE_OPTIONS = ["10", "25", "50", "100"];
export const DEFAULT_TABLE_OPTIONS = {
  sorting: [],
  pagination: {
    page: 1,
    size: Number(ROWS_PER_PAGE_OPTIONS[0]),
    totalPages: 1,
  },
};

const WIDGET_VISUALIZATIONS_MAP: Record<string, string> = {
  [WIDGET_VISUALIZATIONS.AREA_GRAPH]: "Area chart",
  [WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART]: "Bar chart",
  [WIDGET_VISUALIZATIONS.MAP]: "Map",
  [WIDGET_VISUALIZATIONS.PIE_CHART]: "Pie chart",
};

const PROJECTION_VISUALIZATIONS_MAP: Record<string, string> = {
  line_chart: "Line chart",
  bar_chart: "Bar chart",
  bubble_chart: "Bubble chart",
  table: "Table",
};

function getProjectionIndicatorLabel(
  settingsWrapper: CustomProjectionSettingsSchemaType | null,
): string {
  if (!settingsWrapper?.settings) return "";
  const inner = settingsWrapper.settings;

  // The inner settings is a union of { line_chart: ... } | { bar_chart: ... } | etc.
  // Extract vertical indicator value from whichever visualization type is present
  let vertical: string | undefined;
  if ("line_chart" in inner) vertical = inner.line_chart.vertical;
  else if ("bar_chart" in inner) vertical = inner.bar_chart.vertical;
  else if ("bubble_chart" in inner) vertical = inner.bubble_chart.vertical;
  else if ("table" in inner) vertical = inner.table.vertical;

  if (!vertical) return "";
  const match = CHART_INDICATORS.find((i) => i.value === vertical);
  return match?.label ?? vertical;
}

function getProjectionVisualizationLabel(
  settingsWrapper: CustomProjectionSettingsSchemaType | null,
): string {
  if (!settingsWrapper?.settings) return "";
  const inner = settingsWrapper.settings;

  const vizType = Object.keys(inner)[0];
  return PROJECTION_VISUALIZATIONS_MAP[vizType] ?? vizType;
}

function normalizeWidgets(
  widgets: Partial<CustomWidget>[],
): SavedVisualizationRow[] {
  return widgets
    .filter((w): w is CustomWidget => w.id != null)
    .map((w) => ({
      id: w.id,
      name: w.name,
      indicator: w.widget?.title ?? "",
      tool: "Survey Analysis" as const,
      visualization: WIDGET_VISUALIZATIONS_MAP[w.defaultVisualization] ?? "",
      createdAt: new Date(w.createdAt),
      updatedAt: new Date(w.updatedAt),
    }));
}

function normalizeProjections(
  projections: Partial<SavedProjection>[],
): SavedVisualizationRow[] {
  return projections
    .filter((p): p is SavedProjection => p.id != null)
    .map((p) => ({
      id: p.id,
      name: p.name,
      indicator: getProjectionIndicatorLabel(p.settings),
      tool: "Projections" as const,
      visualization: getProjectionVisualizationLabel(p.settings),
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    }));
}

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

  const { data: widgetsData, isFetching: isFetchingWidgets } =
    client.users.searchCustomWidgets.useQuery(
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
          sort: ["-updatedAt"] as SortQueryParam<CustomWidget>,
          pageSize: 1000,
          pageNumber: 1,
        },
      },
      {
        select: (data) => data.body,
        keepPreviousData: true,
      },
    );

  const { data: projectionsData, isFetching: isFetchingProjections } =
    client.savedProjections.searchSavedProjections.useQuery(
      queryKeys.users.savedProjections(session?.user.id as string, {
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
          sort: ["-updatedAt"] as SortQueryParam<SavedProjection>,
          pageSize: 1000,
          pageNumber: 1,
        },
      },
      {
        select: (data) => data.body,
        keepPreviousData: true,
      },
    );

  const isFetching = isFetchingWidgets || isFetchingProjections;

  const mergedData = useMemo(() => {
    const widgets = normalizeWidgets(widgetsData?.data ?? []);
    const projections = normalizeProjections(projectionsData?.data ?? []);
    return [...widgets, ...projections].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
    );
  }, [widgetsData?.data, projectionsData?.data]);

  const paginatedData = useMemo(() => {
    const start = (pagination.page - 1) * pagination.size;
    return mergedData.slice(start, start + pagination.size);
  }, [mergedData, pagination.page, pagination.size]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(mergedData.length / pagination.size)),
    [mergedData.length, pagination.size],
  );

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      totalPages,
    }));
  }, [totalPages]);

  const table = useReactTable({
    columns,
    data: paginatedData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    manualPagination: true,
  });

  if (isFetching) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  if (!mergedData.length)
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
              key={`${row.original.tool}-${row.original.id}`}
              className={cn(
                "cursor-pointer border-l !border-l-transparent transition-colors hover:bg-navy-700",
                {
                  "!border-l-foreground bg-navy-700":
                    selectedRow === String(row.original.id),
                },
              )}
              onClick={() =>
                router.push(
                  row.original.tool === "Survey Analysis"
                    ? getDynamicRouteHref(
                        "surveyAnalysis",
                        "sandbox",
                        String(row.original.id),
                      )
                    : getDynamicRouteHref(
                        "projections",
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
        <div className="col-span-1 flex items-center xl:col-span-6"></div>
        <div className="col-span-12 flex items-center justify-between space-x-8 xl:col-span-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Rows per page</span>
            <Select
              onValueChange={(value) => {
                setPagination({
                  ...pagination,
                  page: 1,
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
