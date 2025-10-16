import { CellContext } from "@tanstack/react-table";
import { useAtom } from "jotai/react";
import { useResetAtom } from "jotai/utils";
import { EllipsisIcon, XIcon } from "lucide-react";

import { selectedRowAtom } from "@/containers/profile/store";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ColumnsTable } from "..";

import ActionsMenu from "./actions-menu";

const ActionsButton = ({ row }: CellContext<ColumnsTable, unknown>) => {
  const [selectedRow] = useAtom(selectedRowAtom);
  const resetSelectedRow = useResetAtom(selectedRowAtom);

  const isRowSelected = selectedRow === String(row.original.id);

  if (isRowSelected) {
    return (
      <Button
        type="button"
        className={
          "group flex h-8 w-8 items-center rounded-full bg-foreground p-2 transition-colors hover:bg-navy-800"
        }
        onClick={resetSelectedRow}
      >
        <XIcon
          className="h-full w-full text-navy-700 group-hover:text-foreground"
          strokeWidth={3}
        />
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          className="flex h-8 w-8 items-center rounded-full bg-navy-700 p-2 transition-colors hover:bg-navy-800"
          onClick={(e) => e.stopPropagation()}
        >
          <EllipsisIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <ActionsMenu id={row.original.id} />
      </PopoverContent>
    </Popover>
  );
};

export default ActionsButton;
