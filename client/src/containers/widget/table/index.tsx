import { FC, useMemo, useState } from "react";

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

type SortColumnKey = "year" | "value";

const COLUMN_KEYS: SortColumnKey[] = ["year", "value"];

interface TableViewProps {
  indicator: string;
  data?: Record<string, number>[];
  headings?: string[];
}
const TableView: FC<TableViewProps> = ({ indicator, data, headings }) => {
  const [sortColumn, setSortColumn] = useState<SortColumnKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const displayHeadings = headings?.length
    ? headings
    : (["Year", "Value"] as const);

  const sortedData = useMemo(() => {
    if (!data?.length) return [];
    if (!sortColumn) return data;
    const next = [...data];
    next.sort((a, b) => {
      const av = a[sortColumn];
      const bv = b[sortColumn];
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return next;
  }, [data, sortColumn, sortDir]);

  const onHeaderClick = (key: SortColumnKey) => {
    if (sortColumn === key) {
      if (sortDir === "asc") {
        setSortDir("desc");
      } else {
        setSortColumn(null);
        setSortDir("asc");
      }
    } else {
      setSortColumn(key);
      setSortDir("asc");
    }
  };

  if (!data || data.length === 0) {
    return <NoData />;
  }

  return (
    <ScrollArea className="h-full">
      <Table>
        <TableHeader>
          <TableRow className="border-none hover:bg-transparent">
            {displayHeadings.map((heading, i) => {
              const columnKey = COLUMN_KEYS[i];

              if (!columnKey) {
                return (
                  <TableHead key={`table-view-heading-${heading}`}>
                    {heading}
                  </TableHead>
                );
              }

              const sorted = sortColumn === columnKey;

              return (
                <TableHead
                  key={`table-view-heading-${heading}`}
                  className="pl-6"
                >
                  <button
                    type="button"
                    className={cn({
                      "inline-flex w-full items-center gap-1.5 text-left font-medium text-muted-foreground transition-colors hover:text-foreground": true,
                      "font-semibold text-foreground": sorted,
                    })}
                    onClick={() => onHeaderClick(columnKey)}
                  >
                    <span>{heading}</span>
                    {!sorted && (
                      <ArrowUpDownIcon className="h-4 w-4 shrink-0 opacity-50" />
                    )}
                    {sorted && sortDir === "asc" && (
                      <ArrowUpIcon className="h-4 w-4 shrink-0" />
                    )}
                    {sorted && sortDir === "desc" && (
                      <ArrowDownIcon className="h-4 w-4 shrink-0" />
                    )}
                  </button>
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((d) => (
            <TableRow
              key={`${indicator}-table-row-${d.year}-${d.value}`}
              className="border-b-bluish-gray-500/35 hover:bg-transparent"
            >
              <TableCell className="pl-6" width="50%">
                {d.year}
              </TableCell>
              <TableCell className="pl-6" width="50%">
                {formatNumber(d.value, {
                  maximumFractionDigits: 3,
                  minimumFractionDigits: 0,
                  notation: "compact",
                  compactDisplay: "short",
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default TableView;
