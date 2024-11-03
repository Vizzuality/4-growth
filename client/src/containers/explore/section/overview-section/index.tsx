import { FC } from "react";

import { BaseWidgetWithData } from "@shared/dto/widgets/base-widget-data.interface";

import TileMenu, { TileMenuItem } from "@/containers/explore/section/tile-menu";
import Widget from "@/containers/widget";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface OverviewSectionProps {
  tileMenuItems: TileMenuItem[];
  widgets: BaseWidgetWithData[];
}

const OverviewSection: FC<OverviewSectionProps> = ({
  widgets,
  tileMenuItems,
}) => {
  return (
    <>
      <div className="col-span-2 grid grid-cols-2 gap-0.5">
        <Widget
          visualization={widgets[0].defaultVisualization}
          visualisations={widgets[0].visualisations}
          indicator={widgets[0].indicator}
          question={widgets[0].question}
          data={widgets[0].data}
          config={{
            menu: { className: "flex flex-col gap-6 py-4" },
          }}
          menuItems={
            <Button
              variant="clean"
              className="block rounded-none px-6 py-2 text-left transition-colors hover:bg-muted"
            >
              Customize chart
            </Button>
          }
        />
        <div className="grid grid-rows-2 gap-0.5">
          <div className="flex gap-0.5" data-testid="overview-single-values">
            <Widget
              visualization={widgets[1].defaultVisualization}
              indicator={widgets[1].indicator}
              question={widgets[1].question}
              data={widgets[1].data}
              config={{ singleValue: { fill: "bg-secondary" } }}
            />
            <Widget
              visualization={widgets[2].defaultVisualization}
              indicator={widgets[2].indicator}
              question={widgets[2].question}
              data={widgets[2].data}
              config={{ singleValue: { fill: "bg-accent" } }}
            />
          </div>
          <Card className="row-start-2 space-y-8 p-0 pb-6">
            <Widget
              visualization={widgets[3].defaultVisualization}
              indicator={widgets[3].indicator}
              data={widgets[3].data}
              config={{ horizontalBarChart: { barSize: 47 } }}
            />
          </Card>
        </div>
      </div>
      <TileMenu items={tileMenuItems} className="t-6 col-span-2 mt-6" />
    </>
  );
};

export default OverviewSection;
