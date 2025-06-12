import { FC } from "react";

import { BaseWidgetWithData } from "@shared/dto/widgets/base-widget-data.interface";

import TileMenu, { TileMenuItem } from "@/containers/explore/section/tile-menu";
import Widget from "@/containers/widget/survey-analysis";

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
          responseRate={widgets[0].responseRate}
          config={{
            menu: { className: "flex flex-col gap-6 py-4" },
          }}
          showCustomizeWidgetButton
        />
        <div className="grid grid-rows-2 gap-0.5">
          <div className="flex gap-0.5" data-testid="overview-single-values">
            <Widget
              visualization={widgets[1].defaultVisualization}
              indicator={widgets[1].indicator}
              question={widgets[1].question}
              data={widgets[1].data}
              responseRate={widgets[1].responseRate}
              config={{ singleValue: { fill: "bg-secondary" } }}
            />
            <Widget
              visualization={widgets[2].defaultVisualization}
              indicator={widgets[2].indicator}
              question={widgets[2].question}
              data={widgets[2].data}
              responseRate={widgets[2].responseRate}
              config={{ singleValue: { fill: "bg-accent" } }}
            />
          </div>
          <Card className="row-start-2 space-y-8 p-0 pb-6">
            <Widget
              visualization={widgets[3].defaultVisualization}
              indicator={widgets[3].indicator}
              data={widgets[3].data}
              responseRate={widgets[3].responseRate}
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
