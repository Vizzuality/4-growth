"use client";

import { FC, useCallback } from "react";

import Link from "next/link";

import { CellContext } from "@tanstack/react-table";
import { useAtom } from "jotai/react";
import { ArrowUpRightIcon, SquarePenIcon } from "lucide-react";

import { selectedRowAtom } from "@/containers/profile/store";

import { getDynamicRouteHref } from "@/utils/route-config";

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
        <Link
          href={getDynamicRouteHref("surveyAnalysis", "sandbox", String(id))}
          className={CLASS}
        >
          <ArrowUpRightIcon />
          <span>Open in Sandbox</span>
        </Link>
      </li>
      <li>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRename();
          }}
          className={CLASS}
        >
          <SquarePenIcon />
          <span>Rename</span>
        </button>
      </li>
      <li>
        <DeleteVisualizationButton id={Number(id)} />
      </li>
    </ul>
  );
};

export default ActionsMenu;
