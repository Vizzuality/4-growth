"use client";
import { useEffect } from "react";

import useSandboxWidget from "@/hooks/use-sandbox-widget";

import Widget from "@/containers/widget";
import SaveWidgetMenu from "@/containers/widget/create-widget";

import { Card } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { client } from "@/lib/queryClient";
import { useSession } from "next-auth/react";
import { queryKeys } from "@/lib/queryKeys";
import { getAuthHeader } from "@/utils/auth-header";

export default function Sandbox() {
  const { visualization, setVisualization, widget } = useSandboxWidget();
  const { id } = useParams();
  const { data: session } = useSession();
  const useCustomWidgetQuery = client.users.findCustomWidget.useQuery(
    queryKeys.users.userChart(session?.user.id as string).queryKey,
    {
      params: {
        id: String(1),
        userId: session?.user.id as string,
      },
      extraHeaders: {
        ...getAuthHeader(session?.accessToken as string),
      },
    },
    {
      select: (data) => data.body,
      enabled: !!id,
    },
  );

  useEffect(() => {
    if (!widget) return;

    if (!visualization || !widget.visualisations.includes(visualization)) {
      setVisualization(widget.defaultVisualization);
    }
  }, [widget, visualization]);

  return (
    <Card className="p-0">
      {widget && (
        <Widget
          breakdown={breakdown || undefined}
          indicator={widget.indicator}
          question={widget.question}
          visualization={visualization || widget.defaultVisualization}
          data={widget.data}
          menu={
            <SaveWidgetMenu
              mode={useCustomWidgetQuery.data ? "update" : "create"}
            />
          }
          className="col-span-1 last:odd:col-span-2"
          config={{ menu: { className: "flex flex-col py-4" } }}
        />
      )}
    </Card>
  );
}
