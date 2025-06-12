"use client";

import { Card } from "@/components/ui/card";
import Title from "@/components/ui/title";

export default function Explore() {
  return (
    <div className="overflow-y-auto pb-32">
      <div className="grid grid-cols-3 gap-0.5">
        <Card className="col-span-2 space-y-4 bg-secondary">
          <Title as="h2" className="text-xl">
            “Projections Model”: Overview
          </Title>
          <p className="text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur. Enim laoreet volutpat
            lobortis ultrices mattis amet gravida augue dapibus.
          </p>
        </Card>
        <Card className="bg-lightgray col-span-1 bg-[url('/images/explore/overview-projections-bg.avif')] bg-cover bg-center bg-no-repeat" />
      </div>
    </div>
  );
}
