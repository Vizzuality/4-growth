import { FC } from "react";

import { Card } from "@/components/ui/card";
import { BaseWidget } from "@shared/dto/widgets/base-widget.entity";
import Widget from "@/containers/widget";
import SingleValue from "@/containers/widget/single-value";
import HorizontalBarChart from "@/containers/widget/horizontal-bar-chart";

const chartWidget: BaseWidget = {
  id: 1,
  sectionOrder: 1,
  indicator: "Organization size",
  visualisations: ["horizontal_bar_chart", "pie_chart"],
  defaultVisualization: "horizontal_bar_chart",
  customWidgets: [],
  section: {
    order: 1,
    name: "Overview",
    slug: "overview",
    description: `Lorem ipsum dolor sit amet consectetur. Enim laoreet volutpat
            lobortis ultrices mattis amet gravida augue dapibus. See methodology`,
    createdAt: new Date("2024-09-20 08:18:32.184047"),
    baseWidgets: [],
  },
  question:
    "What is the size of your agriculture or forestry organization in terms of workforce?",
  createdAt: new Date("2024-09-20 08:18:32.184047"),
  updatedAt: new Date("2024-09-20 08:18:32.184047"),
};

const singleValueWidget: BaseWidget = {
  id: 1,
  sectionOrder: 1,
  indicator: "Total countries",
  visualisations: ["single_value"],
  defaultVisualization: "single_value",
  customWidgets: [],
  section: {
    order: 1,
    name: "Overview",
    slug: "overview",
    description: `Lorem ipsum dolor sit amet consectetur. Enim laoreet volutpat
            lobortis ultrices mattis amet gravida augue dapibus. See methodology`,
    createdAt: new Date("2024-09-20 08:18:32.184047"),
    baseWidgets: [],
  },
  question:
    "What is the size of your agriculture or forestry organization in terms of workforce?",
  createdAt: new Date("2024-09-20 08:18:32.184047"),
  updatedAt: new Date("2024-09-20 08:18:32.184047"),
};

const OverviewSection: FC = () => {
  return (
    <div id="overview" className="grid grid-cols-1 gap-0.5">
      <div className="grid grid-cols-2 gap-0.5">
        <Card className="space-y-4 bg-secondary">
          <h2 className="text-xl font-semibold">
            Digital Agriculture & Forestry Uptake: Overview
          </h2>
          <p className="text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur. Enim laoreet volutpat
            lobortis ultrices mattis amet gravida augue dapibus. See methodology
          </p>
        </Card>
        <Card className="bg-lightgray bg-[url('/images/explore/overview-widget-bg.avif')] bg-cover bg-center bg-no-repeat" />
      </div>
      <div className="grid grid-cols-2 gap-0.5">
        <Card>map widget</Card>
        <div className="grid grid-rows-1 gap-0.5">
          <div className="flex gap-0.5">
            <Card className="p-0">
              <SingleValue
                indicator="Total countries"
                total={23}
                current={23}
                fill="bg-secondary"
              />
            </Card>
            <Card className="p-0">
              <SingleValue
                indicator="Total surveys"
                total={123}
                current={123}
                fill="bg-accent"
              />
            </Card>
          </div>
          <Card className="row-start-2 space-y-8 p-0 pb-6">
            <h3 className="pl-6 pr-6 pt-6 font-semibold">
              Organizations by sector
            </h3>
            <HorizontalBarChart />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;
