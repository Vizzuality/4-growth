"use client";
import { FC, useCallback, useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { useSession } from "next-auth/react";

import {
  getAbsoluteValue,
  getResponseRate,
  normalizeWidgetData,
} from "@/lib/normalize-widget-data";
import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import { useAuthRedirect } from "@/hooks/use-auth-redirect";

import { buildWidgetDownloadUrl } from "@/utils/download-url";

import { DEFAULT_TABLE_OPTIONS } from "@/containers/profile/saved-visualizations/table";
import {
  sandboxBreakdownAtom,
  sandboxFiltersAtom,
  sandboxIndicatorAtom,
  sandboxVisualizationAtom,
} from "@/containers/sidebar/store";
import SandboxMenu from "@/containers/widget/sandbox-menu";
import Widget from "@/containers/widget/survey-analysis";

import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { getAuthHeader } from "@/utils/auth-header";
import { getDynamicRouteHref } from "@/utils/route-config";

interface SandboxProps {
  customWidgetId: string;
}

const Sandbox: FC<SandboxProps> = ({ customWidgetId }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { redirect } = useAuthRedirect();
  const [indicator, setIndicator] = useAtom(sandboxIndicatorAtom);
  const [visualization, setVisualization] = useAtom(sandboxVisualizationAtom);
  const [filters, setFilters] = useAtom(sandboxFiltersAtom);
  const breakdown = useAtomValue(sandboxBreakdownAtom);
  const getCustomWidgetQuery = client.users.findCustomWidget.useQuery(
    queryKeys.users.userChart(customWidgetId).queryKey,
    {
      params: {
        id: Number(customWidgetId),
        userId: session?.user.id as string,
      },
      extraHeaders: {
        ...getAuthHeader(session?.accessToken as string),
      },
    },
    {
      select: (data) => data.body.data,
      enabled: !!customWidgetId,
    },
  );
  const { data: widget } = client.widgets.getWidget.useQuery(
    queryKeys.widgets.one(indicator || "", filters, breakdown || undefined)
      .queryKey,
    {
      params: { id: indicator! },
      query: {
        filters: filters,
        breakdown: breakdown || undefined,
      },
    },
    {
      enabled: !!indicator,
      select: (res) => ({
        ...res.body.data,
        data: {
          raw: res.body.data.data,
          percentages: normalizeWidgetData(res.body.data.data),
        },
        responseRate: getResponseRate(res.body.data.data),
        absoluteValue: getAbsoluteValue(res.body.data.data),
      }),
    },
  );

  const createWidget = useCallback(
    async (name: string) => {
      if (!indicator) return;

      const { status, body } = await client.users.createCustomWidget.mutation({
        params: {
          userId: session?.user.id as string,
        },
        body: {
          name,
          defaultVisualization: visualization as string,
          widgetIndicator: indicator,
          filters,
        },
        extraHeaders: {
          ...getAuthHeader(session?.accessToken as string),
        },
      });

      if (status === 201) {
        await queryClient.invalidateQueries(
          queryKeys.users.userChart(customWidgetId).queryKey,
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
            "surveyAnalysis",
            "sandbox",
            String(body.data.id),
          ),
        );
      } else {
        redirect();
      }
    },
    [
      indicator,
      session?.user.id,
      session?.accessToken,
      visualization,
      filters,
      queryClient,
      customWidgetId,
      toast,
      router,
      redirect,
    ],
  );

  const updateWidget = useCallback(async () => {
    const { status } = await client.users.updateCustomWidget.mutation({
      params: {
        id: Number(customWidgetId),
        userId: session?.user.id as string,
      },
      body: {
        defaultVisualization: visualization || undefined,
        widgetIndicator: indicator || undefined,
        filters,
      },
      extraHeaders: {
        ...getAuthHeader(session?.accessToken as string),
      },
    });

    if (status === 200) {
      await queryClient.invalidateQueries(
        queryKeys.users.userChart(customWidgetId).queryKey,
      );
      toast({
        description: "Your chart has been successfully updated",
      });
    } else {
      redirect();
    }
  }, [
    customWidgetId,
    session?.user.id,
    session?.accessToken,
    visualization,
    indicator,
    filters,
    queryClient,
    toast,
    redirect,
  ]);

  useEffect(() => {
    if (getCustomWidgetQuery.status === "success" && !visualization) {
      setIndicator(getCustomWidgetQuery.data.widget.indicator);
      setVisualization(getCustomWidgetQuery.data.defaultVisualization);

      if (getCustomWidgetQuery.data.filters.length) {
        setFilters(getCustomWidgetQuery.data.filters);
      }
    }
  }, [
    getCustomWidgetQuery.data?.defaultVisualization,
    getCustomWidgetQuery.data?.filters,
    getCustomWidgetQuery.data?.widget.indicator,
    getCustomWidgetQuery.status,
    indicator,
    setFilters,
    setIndicator,
    setVisualization,
    visualization,
  ]);

  return (
    <Card className="p-0">
      {widget && (
        <Widget
          title={widget.title}
          description={widget.description}
          indicator={widget.indicator}
          responseRate={widget.responseRate}
          absoluteValue={widget.absoluteValue}
          question={widget.question}
          visualization={visualization || widget.defaultVisualization}
          data={widget.data}
          hideDownloadCsv
          extraHeaderActions={
            <SandboxMenu
              downloadUrl={buildWidgetDownloadUrl(
                widget.indicator,
                filters,
                breakdown || undefined,
              )}
              onSave={createWidget}
              onUpdate={updateWidget}
            />
          }
          className="col-span-1 last:odd:col-span-2"
          config={{ menu: { className: "flex flex-col py-4" } }}
          breakdown={breakdown || undefined}
        />
      )}
    </Card>
  );
};

export default Sandbox;
