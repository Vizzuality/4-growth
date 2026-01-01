import { FC } from "react";

import TileMenu, { TileMenuItem } from "@/containers/explore/section/tile-menu";
import Widget from "@/containers/widget/survey-analysis";

import { Card } from "@/components/ui/card";
import { TransformedWidget } from "@/types";

interface OverviewSectionProps {
  tileMenuItems: TileMenuItem[];
  widgets: TransformedWidget[];
}

const OverviewSection: FC<OverviewSectionProps> = ({
  widgets,
  tileMenuItems,
}) => {
  const [firstWidget, secondWidget, thirdWidget, fourthWidget] = widgets;
  return (
    <>
      <div className="grid grid-cols-1 gap-0.5 lg:col-span-2 lg:grid-cols-2">
        <Widget
          title={firstWidget.title}
          visualization={firstWidget.defaultVisualization}
          visualisations={firstWidget.visualisations}
          indicator={firstWidget.indicator}
          question={firstWidget.question}
          data={firstWidget.data}
          responseRate={firstWidget.responseRate}
          absoluteValue={firstWidget.absoluteValue}
          config={{
            menu: { className: "flex flex-col gap-6" },
          }}
          showCustomizeWidgetButton
        />
        <div className="grid grid-rows-2 gap-0.5">
          <div className="flex gap-0.5" data-testid="overview-single-values">
            <Widget
              title={secondWidget.title}
              visualization={secondWidget.defaultVisualization}
              indicator={secondWidget.indicator}
              question={secondWidget.question}
              data={secondWidget.data}
              responseRate={secondWidget.responseRate}
              absoluteValue={secondWidget.absoluteValue}
              config={{ singleValue: { fill: "bg-secondary" } }}
            />
            <Widget
              title={thirdWidget.title}
              visualization={thirdWidget.defaultVisualization}
              indicator={thirdWidget.indicator}
              question={thirdWidget.question}
              data={thirdWidget.data}
              responseRate={thirdWidget.responseRate}
              absoluteValue={thirdWidget.absoluteValue}
              config={{ singleValue: { fill: "bg-accent" } }}
            />
          </div>
          <Card className="row-start-2 space-y-8 p-0 pb-6">
            <Widget
              title={fourthWidget.title}
              visualization={fourthWidget.defaultVisualization}
              indicator={fourthWidget.indicator}
              data={fourthWidget.data}
              responseRate={fourthWidget.responseRate}
              absoluteValue={fourthWidget.absoluteValue}
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
