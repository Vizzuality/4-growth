"use client";
import { FC, useEffect } from "react";

import useWidgets from "@/hooks/use-widgets";

import Widget from "@/containers/widget";

import { Card } from "@/components/ui/card";
import UpdateWidgetMenu from "@/containers/widget/update-widget";
import { useSetAtom } from "jotai";
import { customWidgetIdAtom } from "@/containers/sidebar/store";

interface UserSandboxProps {
  customWidgetId: string;
}

const UserSandbox: FC<UserSandboxProps> = ({ customWidgetId }) => {
  const setCustomWidgetId = useSetAtom(customWidgetIdAtom);
  const { visualization, setVisualization, widget } = useWidgets();

  useEffect(() => {
    setCustomWidgetId(customWidgetId);
  }, []);

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
          indicator={widget.indicator}
          question={widget.question}
          visualization={visualization || widget.defaultVisualization}
          data={widget.data}
          menu={<UpdateWidgetMenu />}
          className="col-span-1 last:odd:col-span-2"
          config={{ menu: { className: "flex flex-col py-4" } }}
        />
      )}
    </Card>
  );
};

export default UserSandbox;
