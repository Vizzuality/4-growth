"use client";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import useFilters from "@/hooks/use-filters";

import Widget from "@/containers/widget/projections";

import { Card } from "@/components/ui/card";
import Title from "@/components/ui/title";

export default function Explore() {
  const { filters } = useFilters();
  const { data } = client.projections.getProjectionsWidgets.useQuery(
    queryKeys.projections.widgets.queryKey,
    { query: { filters } },
    { select: (res) => res.body.data },
  );

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
      <div className="grid grid-cols-2 gap-0.5 [&>*:last-child:nth-child(odd)]:col-span-2">
        {data?.map((d) => (
          <Widget
            key={d.id}
            indicator={d.title}
            data={d.data}
            visualisations={d.visualizations}
            visualization={d.defaultVisualization}
          />
        ))}
      </div>
    </div>
  );
}
