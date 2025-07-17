import { FC } from "react";

import { ProjectionWidgetData } from "@shared/dto/projections/projection-widget.entity";

import { formatNumber } from "@/lib/utils";

import NoData from "@/containers/no-data";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface TableViewProps {
  indicator: string;
  data?: ProjectionWidgetData[];
}
const TableView: FC<TableViewProps> = ({ indicator, data }) => {
  if (!data || data.length === 0) {
    return <NoData />;
  }

  return (
    <ScrollArea className="h-full">
      <Table>
        <TableBody>
          {data.map((d) => (
            <TableRow
              key={`${indicator}-table-row-${d.year}`}
              className="border-b-bluish-gray-500/35 hover:bg-transparent"
            >
              <TableCell className="pl-6" width="50%">
                {d.year}
              </TableCell>
              <TableCell className="pl-6" width="50%">
                {formatNumber(d.value, {
                  maximumFractionDigits: 0,
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
