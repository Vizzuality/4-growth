import { FC, useCallback, useMemo, useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react";

import { cn, formatNumber } from "@/lib/utils";

import NoData from "@/containers/no-data";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function humanizeColumnKey(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

interface TableViewProps {
  indicator: string;
  data?: Record<string, number>[];
  headings?: string[];
}

const TableView: FC<TableViewProps> = ({ indicator, data, headings }) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columnKeys = useMemo(() => {
    if (!data?.length) return [];
    return Object.keys(data[0]);
  }, [data]);

  const displayHeadings = useMemo(() => {
    if (!columnKeys.length) return [];
    if (headings?.length === columnKeys.length) return headings;
    return columnKeys.map(humanizeColumnKey);
  }, [columnKeys, headings]);

  const onHeaderClick = useCallback((columnId: string) => {
    setSorting((prev) => {
      const current = prev.find((s) => s.id === columnId);
      if (!current) return [{ id: columnId, desc: false }];
      if (!current.desc) return [{ id: columnId, desc: true }];
      return [];
    });
  }, []);

  const columns = useMemo<ColumnDef<Record<string, number>>[]>(() => {
    return columnKeys.map((key, i) => ({
      id: key,
      accessorKey: key,
      header: ({ column }) => {
        const sorted = column.getIsSorted();
        const label = displayHeadings[i] ?? key;

        return (
          <button
            type="button"
            className={cn({
              "inline-flex w-full items-center gap-1.5 text-left font-medium text-muted-foreground transition-colors hover:text-foreground": true,
              "font-semibold text-foreground": Boolean(sorted),
            })}
            onClick={() => onHeaderClick(column.id)}
          >
            <span>{label}</span>
            {!sorted && (
              <ArrowUpDownIcon className="h-4 w-4 shrink-0 opacity-50" />
            )}
            {sorted === "asc" && <ArrowUpIcon className="h-4 w-4 shrink-0" />}
            {sorted === "desc" && (
              <ArrowDownIcon className="h-4 w-4 shrink-0" />
            )}
          </button>
        );
      },
      cell: ({ row, column }) => {
        const v = row.getValue(column.id) as number;
        if (column.id === "value") {
          return formatNumber(v, {
            maximumFractionDigits: 3,
            minimumFractionDigits: 0,
            notation: "compact",
            compactDisplay: "short",
          });
        }

        return v;
      },
    }));
  }, [columnKeys, displayHeadings, onHeaderClick]);

  const table = useReactTable({
    data: data ?? [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (!data || data.length === 0) {
    return <NoData />;
  }

  return (
    <ScrollArea className="h-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-none hover:bg-transparent"
            >
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="pl-6">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => {
            const cells = row.getVisibleCells();
            const colWidth =
              cells.length > 0 ? `${100 / cells.length}%` : undefined;

            return (
              <TableRow
                key={`${indicator}-table-row-${row.id}`}
                className="border-b-bluish-gray-500/35 hover:bg-transparent"
              >
                {cells.map((cell) => (
                  <TableCell key={cell.id} className="pl-6" width={colWidth}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default TableView;
