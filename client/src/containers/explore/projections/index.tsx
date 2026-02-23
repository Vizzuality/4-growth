"use client";

import dynamic from "next/dynamic";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import useProjectionsCategoryFilter from "@/hooks/use-category-filter";
import useFilters from "@/hooks/use-filters";

import NoData from "@/containers/no-data";
import Widget from "@/containers/widget/projections";

import { MenuPointer } from "@/components/icons/menu-pointer";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import Title from "@/components/ui/title";

const MoreInfoDialog = dynamic(() => import("@/containers/dialog/more-info"), {
  ssr: false,
});

export default function Explore() {
  const { filters } = useFilters();
  const { data, isFetching } =
    client.projections.getProjectionsWidgets.useQuery(
      queryKeys.projections.widgets(filters).queryKey,
      { query: { dataFilters: filters } },
      { select: (res) => res.body.data },
    );

  const { isCategorySelected } = useProjectionsCategoryFilter();

  if (!isCategorySelected) {
    return (
      <Card className="p-0">
        <NoData icon={<MenuPointer />} className="m-6 gap-6">
          <div className="text-center text-sm">
            <p>
              Select an <span className="font-bold">Operation area</span> to
              start your custom visualization
            </p>
          </div>
        </NoData>
      </Card>
    );
  }

  if (isFetching)
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <Spinner className="size-10" />
      </div>
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
            future scenarios for forestry or agriculture.
          </p>
        </Card>
        <Card className="bg-lightgray bg-[url('/images/explore/overview-projections-bg.avif')] bg-cover bg-center bg-no-repeat lg:col-span-1" />
      </div>
      <div className="grid auto-rows-[400px] grid-cols-1 gap-0.5 lg:grid-cols-2 [&>*:last-child:nth-child(odd)]:col-span-2">
        {data?.map((d) => (
          <Widget
            key={d.id}
            indicator={d.title}
            description={d.description}
            data={d.data}
            visualisations={d.visualizations}
            visualization={d.defaultVisualization}
          />
        ))}
      </div>
      <MoreInfoDialog />
    </div>
  );
}
