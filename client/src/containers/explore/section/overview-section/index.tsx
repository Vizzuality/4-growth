import { FC } from "react";

import Widget from "@/containers/widget";
import HorizontalBarChart from "@/containers/widget/horizontal-bar-chart";
import Map from "@/containers/widget/map";

import { Card } from "@/components/ui/card";

const OverviewSection: FC = () => {
  return (
    <div id="overview">
      <div className="grid grid-cols-2 gap-0.5">
        <Card className="p-0">
          <Map
            indicator="Adoption of technology by country"
            question="Has your organisation integrated digital technologies into its workflows?"
            data={{
              NL: 1,
              BE: 2,
              GR: 2,
              LV: 2,
              BY: 3,
              UA: 4,
              MD: 2,
              RO: 2,
              FR: 5,
              IE: 2,
              IS: 1,
              IT: 3,
              CH: 2,
              GB: 4,
              ES: 2,
              PT: 1,
              DE: 3,
              RU: 2,
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
    </div>
  );
};

export default OverviewSection;
