import { FC } from "react";

import { BaseWidgetWithData } from "@shared/dto/widgets/base-widget-data.interface";

import { isEmptyWidget } from "@/lib/utils";

import TileMenu, { TileMenuItem } from "@/containers/explore/section/tile-menu";
import NoData from "@/containers/no-data";
import Widget from "@/containers/widget";
import HorizontalBarChart from "@/containers/widget/horizontal-bar-chart";
import Map from "@/containers/widget/map";

import { Card } from "@/components/ui/card";
import Title from "@/components/ui/title";

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
        <Card className="p-0">
          <Map
            indicator={widgets[0].indicator}
            question={widgets[0].question}
            // TODO: Remove hardcoded data when api response is available
            data={{
              NLD: 1,
              BEL: 2,
              GBR: 2,
              LVA: 2,
              BGR: 3,
              SWE: 4,
              NOR: 2,
              FIN: 1,
              GRC: 1,
              EST: 1,
              UKR: 1,
              DNK: 2,
              POL: 2,
              MD: 2,
              ROU: 2,
              FRA: 5,
              IRL: 2,
              ISL: 1,
              ITA: 3,
              CHE: 2,
              ESP: 2,
              PRT: 1,
              DEU: 3,
              RUS: 2,
              BLR: 1,
              SVN: 1,
              SVK: 2,
              CSK: 3,
              CZE: 3,
              LTU: 3,
              AUT: 4,
              HRC: 3,
              BIH: 2,
              MNE: 1,
              HRV: 3,
              ALB: 3,
              SRB: 4,
              HUN: 2,
              MDA: 3,
            }}
          />
        </Card>
        <div className="grid grid-rows-2 gap-0.5">
          <div className="flex gap-0.5" data-testid="overview-single-values">
            <Widget
              defaultVisualization={widgets[1].defaultVisualization}
              visualisations={widgets[1].visualisations}
              indicator={widgets[1].indicator}
              question={widgets[1].question}
              data={widgets[1].data}
              fill="bg-secondary"
            />
            <Widget
              defaultVisualization={widgets[2].defaultVisualization}
              visualisations={widgets[2].visualisations}
              indicator={widgets[2].indicator}
              question={widgets[2].question}
              data={widgets[2].data}
              fill="bg-accent"
            />
          </div>
          <Card className="row-start-2 space-y-8 p-0 pb-6">
            <Title as="h3" className="px-6 pt-6 text-base">
              {widgets[3].indicator}
            </Title>
            {isEmptyWidget(widgets[3].data) ? (
              <NoData />
            ) : (
              <HorizontalBarChart data={widgets[3].data.chart} />
            )}
          </Card>
        </div>
      </div>
      <TileMenu items={tileMenuItems} className="t-6 col-span-2 mt-6" />
    </>
  );
};

export default OverviewSection;
