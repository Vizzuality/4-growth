"use client";
import { FC } from "react";

import { useAtomValue } from "jotai";

import { DATA_SOURCE_FILTER_NAME } from "@/lib/constants";

import Legend from "@/containers/bottom-bar/data-source-legend/legend";
import { lockedSandboxFiltersAtom } from "@/containers/sidebar/store";

const UserSandboxDataSourceLegend: FC = () => {
  const filters = useAtomValue(lockedSandboxFiltersAtom);
  const values =
    filters.find((f) => f.name === DATA_SOURCE_FILTER_NAME)?.values ?? [];

  return <Legend values={values} />;
};

export default UserSandboxDataSourceLegend;
