import { FC } from "react";

import TileMenu, { TileMenuItem } from "@/containers/explore/section/tile-menu";
import Widget from "@/containers/widget";
import HorizontalBarChart from "@/containers/widget/horizontal-bar-chart";
import Map from "@/containers/widget/map";

import { Card } from "@/components/ui/card";

const OverviewSection: FC<{ tileMenuItems: TileMenuItem[] }> = ({
  tileMenuItems,
}) => {
  return (
    <>
      <div className="col-span-2 grid grid-cols-2 gap-0.5">
        <Card className="p-0">
          <Map
            indicator="Adoption of technology by country"
            question="Has your organisation integrated digital technologies into its workflows?"
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
            }}
          />
        </Card>
        <div className="grid grid-rows-2 gap-0.5">
          <div className="flex gap-0.5">
            <Widget
              defaultVisualization="single_value"
              visualisations={["single_value"]}
              indicator="Total countries"
              question="Location (Country/Region)"
              data={[{ value: 23, total: 23, label: null }]}
              fill="bg-secondary"
            />
            <Widget
              defaultVisualization="single_value"
              visualisations={["single_value"]}
              indicator="Total surveys"
              question="Location (Country/Region)"
              data={[{ value: 123, total: 123, label: null }]}
              fill="bg-accent"
            />
          </div>
          <Card className="row-start-2 space-y-8 p-0 pb-6">
            <h3 className="pl-6 pr-6 pt-6 text-base font-semibold">
              Organizations by sector
            </h3>
            <HorizontalBarChart
              data={[
                { label: "Agriculture", value: 27, total: 27 },
                { label: "Forestry", value: 45, total: 45 },
                { label: "Both", value: 15, total: 15 },
              ]}
            />
          </Card>
        </div>
      </div>
      <TileMenu items={tileMenuItems} className="m t-6 col-span-2" />
    </>
  );
};

export default OverviewSection;
