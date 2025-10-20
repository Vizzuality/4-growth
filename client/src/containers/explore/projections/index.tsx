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
    queryKeys.projections.widgets(filters).queryKey,
    { query: { dataFilters: filters } },
    { select: (res) => res.body.data },
  );

  return (
    <div className="overflow-y-auto pb-32">
      <div className="grid grid-cols-1 grid-rows-[auto_250px] gap-0.5 md:grid-cols-2 md:grid-rows-1 lg:grid-cols-3">
        <Card className="space-y-4 bg-secondary lg:col-span-2">
          <Title as="h2" className="text-xl">
            Projections overview
          </Title>
          <p className="text-muted-foreground">
            Explore how digital transformation could evolve across different
            future scenarios for forestry - with agriculture projections to
            follow soon.
          </p>
        </Card>
        <Card className="bg-lightgray bg-[url('/images/explore/overview-projections-bg.avif')] bg-cover bg-center bg-no-repeat lg:col-span-1" />
      </div>
      <div className="grid auto-rows-[400px] grid-cols-1 gap-0.5 lg:grid-cols-2 [&>*:last-child:nth-child(odd)]:col-span-2">
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
