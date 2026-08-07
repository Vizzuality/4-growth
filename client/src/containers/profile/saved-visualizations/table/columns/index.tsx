import { ColumnDef } from "@tanstack/react-table";

import ActionsButton from "./actions-button";
import CellName from "./cell-name";
import SortingButton from "./sorting-button";

export type VisualizationTool = "Survey Analysis" | "Projections";

export interface SavedVisualizationRow {
  id: number;
  name: string;
  indicator: string;
  tool: VisualizationTool;
  visualization: string;
  createdAt: Date;
  updatedAt: Date;
}

const useColumns = () => {
  const columns: ColumnDef<SavedVisualizationRow>[] = [
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
      accessorKey: "tool",
      header: (headerProps) => (
        <div className="flex space-x-2 text-slate-300">
          <span className="text-sm font-medium">Tool</span>
          <SortingButton {...headerProps} />
        </div>
      ),
      cell: ({ getValue }) => getValue(),
    },
    {
      accessorKey: "visualization",
      header: (headerProps) => (
        <div className="flex space-x-2 text-slate-300">
          <span className="text-sm font-medium">Visualization</span>
          <SortingButton {...headerProps} />
        </div>
      ),
      cell: (cellProps) => (
        <div className="flex items-center justify-between md:pr-6">
          <span>{cellProps.getValue() as string}</span>
          <ActionsButton {...cellProps} />
        </div>
      ),
    },
  ];

  return columns;
};

export default useColumns;
