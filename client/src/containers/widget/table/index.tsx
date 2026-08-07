import { FC, useCallback, useMemo, useRef, useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  type ColumnDef,
  type Row,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
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

const ROW_HEIGHT = 40;
const VIRTUALIZATION_THRESHOLD = 500;

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
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const rows = table.getRowModel().rows;
  const enableVirtualization = rows.length > VIRTUALIZATION_THRESHOLD;

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 20,
    enabled: enableVirtualization,
  });

  if (!data || data.length === 0) {
    return <NoData />;
  }

  const renderRow = (row: Row<Record<string, number>>) => {
    const cells = row.getVisibleCells();
    const colWidth = cells.length > 0 ? `${100 / cells.length}%` : undefined;

    return cells.map((cell) => (
      <TableCell key={cell.id} className="pl-6" width={colWidth}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </TableCell>
    ));
  };

  const headerContent = table.getHeaderGroups().map((headerGroup) => (
    <TableRow key={headerGroup.id} className="border-none hover:bg-transparent">
      {headerGroup.headers.map((header) => (
        <TableHead key={header.id} className="pl-6">
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
        </TableHead>
      ))}
    </TableRow>
  ));

  if (!enableVirtualization) {
    return (
      <ScrollArea className="h-full">
        <Table>
          <TableHeader>{headerContent}</TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={`${indicator}-table-row-${row.id}`}
                className="border-b-bluish-gray-500/35 hover:bg-transparent"
              >
                {renderRow(row)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    );
  }

  const virtualItems = virtualizer.getVirtualItems();
  const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
  const paddingBottom =
    virtualItems.length > 0
      ? virtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end
      : 0;

  return (
    <div ref={scrollRef} className="relative h-full w-full overflow-auto">
      <table className="w-full caption-bottom text-sm">
        <TableHeader className="sticky top-0 z-10 bg-primary shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
          {headerContent}
        </TableHeader>
        <TableBody>
          {paddingTop > 0 && (
            <tr>
              <td style={{ height: paddingTop }} />
            </tr>
          )}
          {virtualItems.map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <TableRow
                key={`${indicator}-table-row-${row.id}`}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className="border-b-bluish-gray-500/35 hover:bg-transparent"
              >
                {renderRow(row)}
              </TableRow>
            );
          })}
          {paddingBottom > 0 && (
            <tr>
              <td style={{ height: paddingBottom }} />
            </tr>
          )}
        </TableBody>
      </table>
    </div>
  );
};

export default TableView;
