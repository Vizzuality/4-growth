"use client";
import { FC, useMemo } from "react";

import { ProjectionVisualizationsType } from "@shared/dto/projections/projection-visualizations.constants";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import useFilters from "@/hooks/use-filters";
import useSettings from "@/hooks/use-settings";

import {
  getKeys,
  isBubbleChartSettings,
  isSimpleChartSettings,
} from "@/containers/sidebar/projections-settings/utils";
import SandboxWidget from "@/containers/widget/projections/sandbox";

const Sandbox: FC = () => {
  const { settings } = useSettings();
  const { filters } = useFilters();
  const { data } = client.projections.getCustomProjection.useQuery(
    queryKeys.projections.custom(settings, filters).queryKey,
    {
      query: {
        dataFilters: [],
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
  const visualization: ProjectionVisualizationsType = useMemo(() => {
    if (isSimpleChartSettings(settings)) {
      return getKeys(settings)[0];
    }

    if (isBubbleChartSettings(settings)) {
      return "bubble_chart";
    }

    return "line_chart";
  }, [settings]);
  const indicator = useMemo(() => {
    if (isSimpleChartSettings(settings)) {
      return Object.values(settings)[0].vertical;
    }

    return "";
  }, [settings]);

  if (!data) return null;

  return (
    <SandboxWidget
      indicator={indicator}
      visualization={visualization}
      data={data}
    />
  );
};

export default Sandbox;
