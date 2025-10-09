"use client";
import { FC, useMemo } from "react";

import { CountryISOMap } from "@shared/constants/country-iso.map";
import { CustomProjection } from "@shared/dto/projections/custom-projection.type";
import { ProjectionVisualizationsType } from "@shared/dto/projections/projection-visualizations.constants";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import useFilters from "@/hooks/use-filters";
import useSettings from "@/hooks/use-settings";

import NoData from "@/containers/no-data";
import {
  colorIsCountry,
  getKeys,
  isBubbleChartSettings,
  isSimpleChartSettings,
} from "@/containers/sidebar/projections-settings/utils";
import SandboxWidget from "@/containers/widget/projections/sandbox";

import MenuPointer from "@/components/icons/menu-pointer";
import { Card } from "@/components/ui/card";

const Sandbox: FC = () => {
  const { settings } = useSettings();
  const { filters } = useFilters();
  const { data, isFetching } = client.projections.getCustomProjection.useQuery(
    queryKeys.projections.custom(settings, filters).queryKey,
    {
      query: {
        dataFilters: filters,
        settings: settings
          ? settings
          : {
              line_chart: {
                vertical: "market-potential",
                color: "application",
              },
            },
      },
    },
    {
      enabled: !!settings,
      retry: 0,
      select: (res) => {
        if (colorIsCountry(settings)) {
          const payload = res.body.data as CustomProjection;
          return Object.fromEntries(
            Object.keys(payload).map((unit) => [
              unit,
              payload[unit].map((d) => ({
                ...d,
                color:
                  d.color !== "Others"
                    ? CountryISOMap.getCountryNameByISO3(String(d.color))
                    : d.color,
              })),
            ]),
          ) as CustomProjection;
        }

        return res.body.data;
      },
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

  if (isFetching) return null;

  if (!data)
    return (
      <Card className="p-0">
        <NoData icon={<MenuPointer />} className="m-6 gap-6">
          <div className="text-center">
            <p>
              The Sandbox allows users to create customized visualizations and
              explore multiple data series at once by combining different
              variables in a single graph.
            </p>
            <p>
              Select a visualization type and then select indicators and filters
              to customize your view.
            </p>
          </div>
        </NoData>
      </Card>
    );

  return (
    <SandboxWidget
      className="justify-end"
      indicator={indicator}
      visualization={visualization}
      data={data}
    />
  );
};

export default Sandbox;
