"use client";
import { FC, useEffect, useMemo, useRef } from "react";

import { CountryISOMap } from "@shared/constants/country-iso.map";
import {
  CustomProjection,
  SimpleProjection,
} from "@shared/dto/projections/custom-projection.type";
import { ProjectionVisualizationsType } from "@shared/dto/projections/projection-visualizations.constants";
import qs from "qs";
import { useSession } from "next-auth/react";

import { env } from "@/env";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import useProjectionsCategoryFilter from "@/hooks/use-category-filter";
import useFilters, { FilterQueryParam } from "@/hooks/use-filters";
import useSettings from "@/hooks/use-settings";
import { getAuthHeader } from "@/utils/auth-header";

import NoData from "@/containers/no-data";
import {
  colorIsCountry,
  getKeys,
  isBubbleChartSettings,
  isSimpleChartSettings,
} from "@/containers/sidebar/projections-settings/utils";
import CreateSavedProjectionMenu from "@/containers/widget/create-saved-projection";
import UpdateSavedProjectionMenu from "@/containers/widget/update-saved-projection";
import SandboxWidget from "@/containers/widget/projections/sandbox";

import MenuPointer from "@/components/icons/menu-pointer";
import { Card } from "@/components/ui/card";

interface SandboxProps {
  savedProjectionId?: string;
}

const Sandbox: FC<SandboxProps> = ({ savedProjectionId }) => {
  const { data: session } = useSession();
  const { settings, othersAggregation } = useSettings();
  const { filters, setFilters } = useFilters();
  const initialized = useRef(false);

  const savedProjectionQuery =
    client.savedProjections.findSavedProjection.useQuery(
      queryKeys.users.savedProjection(savedProjectionId ?? "").queryKey,
      {
        params: {
          id: Number(savedProjectionId),
          userId: session?.user?.id as string,
        },
        extraHeaders: {
          ...getAuthHeader(session?.accessToken as string),
        },
      },
      {
        enabled: !!savedProjectionId && !!session,
        select: (data) => data.body.data,
      },
    );

  useEffect(() => {
    if (
      savedProjectionQuery.status === "success" &&
      savedProjectionQuery.data &&
      !initialized.current
    ) {
      initialized.current = true;
      const { settings: savedSettings, dataFilters } =
        savedProjectionQuery.data;

      if (savedSettings?.settings) {
        const settingsStr = qs.stringify(
          { settings: savedSettings.settings },
          { encode: false },
        );
        const url = new URL(window.location.href);
        url.searchParams.set("s", settingsStr);
        window.history.replaceState(null, "", url.toString());
      }

      if (dataFilters?.length) {
        setFilters(dataFilters as FilterQueryParam[]);
      }
    }
  }, [savedProjectionQuery.status, savedProjectionQuery.data, setFilters]);
  const { isCategorySelected } = useProjectionsCategoryFilter();
  const { data, isFetching } = client.projections.getCustomProjection.useQuery(
    queryKeys.projections.custom(settings, filters, othersAggregation).queryKey,
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
        othersAggregation,
      },
    },
    {
      enabled: !!settings,
      retry: 0,
      select: (res) => {
        if (colorIsCountry(settings)) {
          const payload = res.body.data as SimpleProjection;
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
  const { data: settingsData } =
    client.projections.getCustomProjectionSettings.useQuery(
      queryKeys.projections.settingsAll.queryKey,
      {
        query: {},
      },
      { select: (res) => res.body.data },
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
      const visualization = Object.keys(settings)[0] as
        | "line_chart"
        | "bar_chart";

      return (
        settingsData?.[visualization].vertical.find(
          (obj) => obj.value === Object.values(settings)[0].vertical,
        )?.label || ""
      );
    }

    return "";
  }, [settings, settingsData]);

  if (isFetching) return null;

  if (!isCategorySelected) {
    return (
      <Card className="p-0">
        <NoData icon={<MenuPointer />} className="m-6 gap-6">
          <div className="text-center text-sm">
            <p>
              Select an <span className="font-bold">Operation area</span> to
              start your custom visualization
            </p>
          </div>
        </NoData>
      </Card>
    );
  }

  if (!data)
    return (
      <Card className="p-0">
        <NoData icon={<MenuPointer />} className="m-6 gap-6">
          <div className="text-center text-sm">
            <p>
              Select a visualization type and then select indicators and filters
              to customize your view.
            </p>
          </div>
        </NoData>
      </Card>
    );

  const downloadUrl = `${env.NEXT_PUBLIC_API_URL}/projections/custom-widget/export?${qs.stringify(
    { filters, settings, othersAggregation },
    { encode: false },
  )}`;

  return (
    <SandboxWidget
      className="justify-end"
      indicator={indicator}
      visualization={visualization}
      data={data}
      downloadUrl={downloadUrl}
      save={
        savedProjectionId ? (
          <UpdateSavedProjectionMenu
            savedProjectionId={savedProjectionId}
            settings={settings}
            filters={filters}
            othersAggregation={othersAggregation}
          />
        ) : (
          <CreateSavedProjectionMenu
            settings={settings}
            filters={filters}
            othersAggregation={othersAggregation}
          />
        )
      }
    />
  );
};

export default Sandbox;
