import { HeaderContext } from "@tanstack/react-table";
import { ArrowUpDownIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react";

import { ColumnsTable } from "..";

const SortingButton = ({ column }: HeaderContext<ColumnsTable, unknown>) => {
  const isSorted = column.getIsSorted();

  return (
    <button
      type="button"
      onClick={() => {
        if (isSorted === "asc") {
          return column.clearSorting();
        }

        column.toggleSorting(
          column.getIsSorted()
            ? column.getIsSorted() === "asc"
              ? true
              : false
            : true,
        );
      }}
      className="flex items-center space-x-1"
    >
      {!isSorted && <ArrowUpDownIcon className="h-5 w-5" />}
      {isSorted === "asc" && <ArrowUpIcon className="h-5 w-5" />}
      {isSorted === "desc" && <ArrowDownIcon className="h-5 w-5" />}
    </button>
  );
};

export default SortingButton;
