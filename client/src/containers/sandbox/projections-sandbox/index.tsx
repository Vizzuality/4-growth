"use client";
import { FC, useCallback, useEffect, useMemo, useRef } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { CountryISOMap } from "@shared/constants/country-iso.map";
import {
  CustomProjection,
  SimpleProjection,
} from "@shared/dto/projections/custom-projection.type";
import { ProjectionVisualizationsType } from "@shared/dto/projections/projection-visualizations.constants";
import { useQueryClient } from "@tanstack/react-query";
import qs from "qs";
import { useSession } from "next-auth/react";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import useProjectionsCategoryFilter from "@/hooks/use-category-filter";
import useFilters, { FilterQueryParam } from "@/hooks/use-filters";
import useSettings from "@/hooks/use-settings";

import { buildProjectionDownloadUrl } from "@/utils/download-url";
import { getAuthHeader } from "@/utils/auth-header";
import { getDynamicRouteHref } from "@/utils/route-config";

import NoData from "@/containers/no-data";
import { DEFAULT_TABLE_OPTIONS } from "@/containers/profile/saved-visualizations/table";
import {
  colorIsCountry,
  getKeys,
  isBubbleChartSettings,
  isSimpleChartSettings,
} from "@/containers/sidebar/projections-settings/utils";
import SandboxMenu from "@/containers/widget/sandbox-menu";
import SandboxWidget from "@/containers/widget/projections/sandbox";

import MenuPointer from "@/components/icons/menu-pointer";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface SandboxProps {
  savedProjectionId?: string;
}

const Sandbox: FC<SandboxProps> = ({ savedProjectionId }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { redirect } = useAuthRedirect();
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

  const createSavedProjection = useCallback(
    async (name: string) => {
      if (!settings) return;

      const { status, body } =
        await client.savedProjections.createSavedProjection.mutation({
          params: {
            userId: session?.user.id as string,
          },
          body: {
            name,
            settings: { settings, othersAggregation },
            dataFilters: filters,
          },
          extraHeaders: {
            ...getAuthHeader(session?.accessToken as string),
          },
        });

      if (status === 201) {
        if (savedProjectionId) {
          await queryClient.invalidateQueries(
            queryKeys.users.savedProjection(savedProjectionId).queryKey,
          );
        }
        queryClient.invalidateQueries(
          queryKeys.users.savedProjections(
            session?.user.id as string,
            DEFAULT_TABLE_OPTIONS,
          ).queryKey,
        );
        toast({
          description: (
            <>
              <p>Your chart has been successfully saved in </p>
              <Link href="/profile" className="font-bold underline">
                your profile.
              </Link>
            </>
          ),
        });

        router.push(
          getDynamicRouteHref(
            "projections",
            "sandbox",
            String(body.data.id),
          ),
        );
      } else {
        redirect();
      }
    },
    [
      settings,
      othersAggregation,
      session?.user.id,
      session?.accessToken,
      filters,
      savedProjectionId,
      queryClient,
      toast,
      router,
      redirect,
    ],
  );

  const updateSavedProjection = useCallback(async () => {
    if (!settings || !savedProjectionId) return;

    const { status } =
      await client.savedProjections.updateSavedProjection.mutation({
        params: {
          id: Number(savedProjectionId),
          userId: session?.user.id as string,
        },
        body: {
          settings: { settings, othersAggregation },
          dataFilters: filters,
        },
        extraHeaders: {
          ...getAuthHeader(session?.accessToken as string),
        },
      });

    if (status === 200) {
      await queryClient.invalidateQueries(
        queryKeys.users.savedProjection(savedProjectionId).queryKey,
      );
      toast({
        description: "Your chart has been successfully updated",
      });
    } else {
      redirect();
    }
  }, [
    settings,
    othersAggregation,
    savedProjectionId,
    session?.user.id,
    session?.accessToken,
    filters,
    queryClient,
    toast,
    redirect,
  ]);

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

  const downloadUrl = buildProjectionDownloadUrl(
    filters,
    settings,
    othersAggregation,
  );

  return (
    <SandboxWidget
      className="justify-end"
      indicator={indicator}
      visualization={visualization}
      data={data}
      menu={
        <SandboxMenu
          downloadUrl={downloadUrl}
          onSave={createSavedProjection}
          onUpdate={savedProjectionId ? updateSavedProjection : undefined}
        />
      }
    />
  );
};

export default Sandbox;
