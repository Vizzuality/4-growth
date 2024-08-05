import { CustomChart } from "@shared/dto/custom-charts/custom-chart.entity";
import { ColumnDef } from "@tanstack/react-table";

import ActionsButton from "./actions-button";
import CellName from "./cell-name";
import SortingButton from "./sorting-button";

export interface ColumnsTable extends Partial<CustomChart> {}

const useColumns = () => {
  const columns: ColumnDef<Partial<CustomChart>>[] = [
    {
      accessorKey: "name",
      header: (headerProps) => (
        <div className="flex space-x-2 text-slate-300">
          <span className="text-sm font-medium">Name</span>
          <SortingButton {...headerProps} />
        </div>
      ),
      cell: (cellProps) => <CellName {...cellProps} />,
    },
    {
      accessorKey: "indicator",
      header: (headerProps) => (
        <div className="flex space-x-2 text-slate-300">
          <span className="text-sm font-medium">Indicator</span>
          <SortingButton {...headerProps} />
        </div>
      ),
      cell: ({ getValue }) => getValue(),
    },
    {
      accessorKey: "type",
      header: (headerProps) => (
        <div className="flex space-x-2 text-slate-300">
          <span className="text-sm font-medium">Type of chart</span>
          <SortingButton {...headerProps} />
        </div>
      ),
      cell: (cellProps) => (
        <div className="flex items-center justify-between pr-6">
          <span>{cellProps.getValue() as string}</span>
          <ActionsButton {...cellProps} />
        </div>
      ),
    },
  ];

  return columns;
};

export default useColumns;
