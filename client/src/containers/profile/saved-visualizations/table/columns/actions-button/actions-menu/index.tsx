"use client";

import { FC, useCallback } from "react";

import Link from "next/link";

import { CellContext } from "@tanstack/react-table";
import { useAtom } from "jotai/react";
import { ArrowUpRightIcon, SquarePenIcon } from "lucide-react";

import { selectedRowAtom } from "@/containers/profile/store";

import { ColumnsTable } from "../..";

import DeleteVisualizationButton from "./delete-visualization-button";

export const CLASS =
  "flex w-full items-center px-4 py-2 space-x-2 hover:bg-muted transition-colors";

const ActionsMenu: FC<{
  id: CellContext<ColumnsTable, unknown>["row"]["original"]["id"];
}> = ({ id }) => {
  const [, setSelectedRow] = useAtom(selectedRowAtom);
  const handleRename = useCallback(() => {
    setSelectedRow(String(id));
  }, [setSelectedRow, id]);

  return (
    <ul className="overflow-hidden py-2 text-xs font-medium">
      <li>
        <Link href={`/sandbox/${id}`} className={CLASS} target="_blank">
          <ArrowUpRightIcon />
          <span>Open in Sandbox</span>
        </Link>
      </li>
      <li>
        <button onClick={handleRename} className={CLASS}>
          <SquarePenIcon />
          <span>Rename</span>
        </button>
      </li>
      <li>
        <DeleteVisualizationButton id={String(id)} />
      </li>
    </ul>
  );
};

export default ActionsMenu;
