"use client";

import { FC, useCallback } from "react";

import Link from "next/link";

import { useAtom } from "jotai/react";
import { ArrowUpRightIcon, SquarePenIcon } from "lucide-react";

import { selectedRowAtom } from "@/containers/profile/store";

import { getDynamicRouteHref } from "@/utils/route-config";

import { VisualizationTool } from "../..";

import DeleteVisualizationButton from "./delete-visualization-button";

export const CLASS =
  "flex w-full items-center px-4 py-2 space-x-2 hover:bg-muted transition-colors";

const ActionsMenu: FC<{
  id: number;
  tool: VisualizationTool;
}> = ({ id, tool }) => {
  const [, setSelectedRow] = useAtom(selectedRowAtom);
  const handleRename = useCallback(() => {
    setSelectedRow(String(id));
  }, [setSelectedRow, id]);

  const sandboxHref =
    tool === "Survey Analysis"
      ? getDynamicRouteHref("surveyAnalysis", "sandbox", String(id))
      : getDynamicRouteHref("projections", "sandbox", String(id));

  return (
    <ul className="overflow-hidden py-2 text-xs font-medium">
      <li>
        <Link href={sandboxHref} className={CLASS}>
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
        <DeleteVisualizationButton id={id} tool={tool} />
      </li>
    </ul>
  );
};

export default ActionsMenu;
