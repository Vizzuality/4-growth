"use client";
import { FC } from "react";

import { useQueryState } from "nuqs";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import useSettings from "@/hooks/use-settings";

const Sandbox: FC = () => {
  const [indicator] = useQueryState("indicator", {
    defaultValue: "",
  });
  const { settings } = useSettings();
  client.projections.getCustomProjection.useQuery(
    queryKeys.projections.custom(indicator, []).queryKey,
    {
      query: {
        dataFilters: [],
        // settings,
        settings: settings
          ? settings
          : { line_chart: { vertical: "market-potential" } },
      },
    },
    {
      enabled: !!settings,
      retry: 0,
      select: (res) => res.body.data,
    },
  );

  return null;
};

export default Sandbox;
