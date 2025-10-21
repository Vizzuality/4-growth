import { CustomWidget } from "@shared/dto/widgets/custom-widget.entity";
import { WIDGET_VISUALIZATIONS } from "@shared/dto/widgets/widget-visualizations.constants";
import { ColumnDef } from "@tanstack/react-table";

import ActionsButton from "./actions-button";
import CellName from "./cell-name";
import SortingButton from "./sorting-button";

export interface ColumnsTable extends Partial<CustomWidget> {}

const WIDGET_VISUALIZATIONS_MAP: Record<string, string> = {
  [WIDGET_VISUALIZATIONS.AREA_GRAPH]: "Area chart",
  [WIDGET_VISUALIZATIONS.HORIZONTAL_BAR_CHART]: "Bar chart",
  [WIDGET_VISUALIZATIONS.MAP]: "Map",
  [WIDGET_VISUALIZATIONS.PIE_CHART]: "Pie chart",
};

const useColumns = () => {
  const columns: ColumnDef<Partial<CustomWidget>>[] = [
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
      accessorKey: "widget.title",
      header: (headerProps) => (
        <div className="flex space-x-2 text-slate-300">
          <span className="text-sm font-medium">Indicator</span>
          <SortingButton {...headerProps} />
        </div>
      ),
      cell: ({ getValue }) => getValue(),
    },
    {
      accessorKey: "defaultVisualization",
      header: (headerProps) => (
        <div className="flex space-x-2 text-slate-300">
          <span className="text-sm font-medium">Type of chart</span>
          <SortingButton {...headerProps} />
        </div>
      ),
      cell: (cellProps) => (
        <div className="flex items-center justify-between md:pr-6">
          <span>
            {WIDGET_VISUALIZATIONS_MAP[cellProps.getValue() as string]}
          </span>
          <ActionsButton {...cellProps} />
        </div>
      ),
    },
  ];

  return columns;
};

export default useColumns;
