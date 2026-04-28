"use client";
import { FC, useCallback, useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import useFilters from "@/hooks/use-filters";
import useSandboxWidget from "@/hooks/use-sandbox-widget";

import { buildWidgetDownloadUrl } from "@/utils/download-url";

import NoData from "@/containers/no-data";
import { DEFAULT_TABLE_OPTIONS } from "@/containers/profile/saved-visualizations/table";
import SandboxMenu from "@/containers/widget/sandbox-menu";
import Widget from "@/containers/widget/survey-analysis";

import CloudOff from "@/components/icons/cloud-off";
import MenuPointer from "@/components/icons/menu-pointer";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { getAuthHeader } from "@/utils/auth-header";
import { getDynamicRouteHref } from "@/utils/route-config";

const Sandbox: FC = () => {
  const {
    breakdown,
    indicator,
    visualization,
    setVisualization,
    getWidgetQuery: { data: widget, error, isFetched },
  } = useSandboxWidget();
  const { filters } = useFilters();
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { redirect } = useAuthRedirect();

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
        queryClient.invalidateQueries(
          queryKeys.users.userCharts(
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
      toast,
      router,
      redirect,
      queryClient,
    ],
  );

  let Comp: JSX.Element | null = null;

  if (!isFetched && !indicator && !widget && !error) {
    Comp = (
      <NoData icon={<MenuPointer />} className="m-6 gap-6">
        <div className="text-center text-sm">
          <p>
            Select an <span className="font-bold">indicator</span> in Settings
            to start your custom visualization
          </p>
        </div>
      </NoData>
    );
  }

  if (widget) {
    const downloadUrl = buildWidgetDownloadUrl(
      widget.indicator,
      filters,
      breakdown || undefined,
    );

    Comp = (
      <Widget
        title={widget.title}
        description={widget.description}
        breakdown={breakdown || undefined}
        indicator={widget.indicator}
        responseRate={widget.responseRate}
        absoluteValue={widget.absoluteValue}
        question={widget.question}
        visualization={visualization || widget.defaultVisualization}
        data={widget.data}
        hideDownloadCsv
        extraHeaderActions={
          <SandboxMenu
            downloadUrl={downloadUrl}
            onSave={createWidget}
          />
        }
        className="col-span-1 last:odd:col-span-2"
        config={{ menu: { className: "flex flex-col py-4" } }}
      />
    );
  }

  if (error) {
    Comp =
      error.status === 404 ? (
        <NoData />
      ) : (
        <NoData
          icon={<CloudOff />}
          description="Something went wrong, please check back soon."
        />
      );
  }

  useEffect(() => {
    if (!widget) return;

    if (!visualization || !widget.visualisations.includes(visualization)) {
      setVisualization(widget.defaultVisualization);
    }
  }, [widget, visualization, setVisualization]);

  return <Card className="p-0">{Comp}</Card>;
};

export default Sandbox;
