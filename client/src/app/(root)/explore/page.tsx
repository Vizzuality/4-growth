"use client";
import { useState } from "react";

import OverviewSection from "@/containers/explore/section/overview-section";

import { Overlay } from "@/components/ui/overlay";
import Widget from "@/containers/widget";
import { BaseWidget } from "@shared/dto/widgets/base-widget.entity";
import { Card } from "@/components/ui/card";
import AreaChart from "@/containers/widget/area-chart";
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
const pieChartWidget: BaseWidget = {
  id: 2,
  sectionOrder: 2,
  indicator: "Experience level",
  visualisations: ["horizontal_bar_chart", "pie_chart"],
  defaultVisualization: "pie_chart",
  customWidgets: [],
  section: {
    order: 2,
    name: "Overview",
    slug: "overview",
    description: `Lorem ipsum dolor sit amet consectetur. Enim laoreet volutpat
            lobortis ultrices mattis amet gravida augue dapibus. See methodology`,
    createdAt: new Date("2024-09-20 08:18:32.184047"),
    baseWidgets: [],
  },
  question:
    "What is the general level of work experience in your organisation?",
  createdAt: new Date("2024-09-20 08:18:32.184047"),
  updatedAt: new Date("2024-09-20 08:18:32.184047"),
};
export default function ExplorePage() {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <>
      {showOverlay && <Overlay />}
      {/* <OverviewSection /> */}
      <div className="grid grid-cols-2 gap-0.5">
        <Widget
          data={pieChartWidget}
          className="col-span-1 last:odd:col-span-2"
          onMenuOpenChange={setShowOverlay}
        />
        <Widget
          data={chartWidget}
          className="col-span-1 last:odd:col-span-2"
          onMenuOpenChange={setShowOverlay}
        />
        <Card className="col-span-1 min-h-72 p-0 last:odd:col-span-2">
          <AreaChart
            indicator="Data sharing"
            question="Do you share this data?"
            answers={[
              { label: "Yes", value: 15 },
              { label: "No", value: 25 },
              { label: "Don't know", value: 60 },
            ]}
          />
        </Card>
        <Card className="col-span-1 min-h-72 p-0 last:odd:col-span-2">
          <AreaChart
            indicator="Socio-economic benefits"
            question="Have you experienced socio-economic benefits through the use of digital technologies?"
            answers={[
              { label: "Yes", value: 32 },
              { label: "No", value: 48 },
              { label: "Don't know", value: 20 },
            ]}
          />
        </Card>
        <Card className="col-span-1 min-h-72 p-0 last:odd:col-span-2">
          <AreaChart
            indicator="Regulatory considerations"
            question="Are there regulatory considerations influencing the governance of digital technology adoption?"
            answers={[
              { label: "Yes", value: 2 },
              { label: "No", value: 36 },
              { label: "Don't know", value: 62 },
            ]}
          />
        </Card>
        <Card className="col-span-1 min-h-72 p-0 last:odd:col-span-2">
          <AreaChart
            indicator="Regulatory considerations"
            question="Are there regulatory considerations influencing the governance of digital technology adoption?"
            answers={[
              { label: "Yes", value: 2 },
              { label: "No", value: 36 },
              { label: "Don't know", value: 62 },
            ]}
          />
        </Card>
      </div>
    </>
  );
}
