import { FC } from "react";

import { Card } from "@/components/ui/card";

const OverviewSection: FC = () => {
  return (
    <div id="overview" className="grid grid-cols-1 gap-0.5">
      <div className="grid grid-cols-2 gap-0.5">
        <Card className="space-y-2 bg-secondary">
          <h2 className="text-xl font-semibold">
            Digital Agriculture & Forestry Uptake: Overview
          </h2>
          <p className="text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur. Enim laoreet volutpat
            lobortis ultrices mattis amet gravida augue dapibus. See methodology
          </p>
        </Card>
        <Card className="bg-lightgray bg-[url('/images/explore/overview-widget-bg.jpg')] bg-cover bg-center bg-no-repeat" />
      </div>
      <div className="grid grid-cols-2 gap-0.5">
        <Card>map widget</Card>
        <div className="grid grid-rows-2 gap-0.5">
          <div className="flex gap-0.5">
            <Card>count widget</Card>
            <Card>count widget</Card>
          </div>
          <Card className="row-start-2">horizontal bar widget</Card>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;
