"use client";

import { useMemo, useRef } from "react";

import dynamic from "next/dynamic";

import { useSetAtom } from "jotai";

import { OVERVIEW_SECTION_ORDER } from "@/lib/constants";
import { normalizeSections } from "@/lib/normalize-widget-data";
import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import {
  getEmptySectionSlugs,
  getVisibleWidgets,
} from "@/lib/widget-visibility";

import useFilters from "@/hooks/use-filters";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";

import Section from "@/containers/explore/section";
import OverviewSection from "@/containers/explore/section/overview-section";
import { intersectingAtom } from "@/containers/explore/store";
import Widget from "@/containers/widget/survey-analysis";

import { Spinner } from "@/components/ui/spinner";
import { TransformedWidgetData } from "@/types";
import { useScrollSpy } from "tests/hooks/use-scroll-spy";

const MoreInfoDialog = dynamic(() => import("@/containers/dialog/more-info"), {
  ssr: false,
});

export default function Explore() {
  const { filters } = useFilters();
  const { data, isFetching } = client.sections.getSections.useQuery(
    queryKeys.sections.all(filters).queryKey,
    { query: { filters } },
    { select: (res) => normalizeSections(res.body.data) },
  );
  const sections = useMemo(() => data || [], [data]);
  const emptySectionSlugs = useMemo(
    () => getEmptySectionSlugs(sections, filters),
    [sections, filters],
  );
  const tileMenuItems = useMemo(
    () =>
      sections.map((s) => ({
        name: s.name,
        description: s.description,
        slug: s.slug,
        isEmpty: emptySectionSlugs.has(s.slug),
      })),
    [sections, emptySectionSlugs],
  );
  const ref = useRef<HTMLDivElement>(null);
  const setIntersecting = useSetAtom(intersectingAtom);

  useScrollSpy({
    containerRef: ref,
    setCurrentStep: setIntersecting,
    options: {
      threshold: 0,
      rootMargin: "-50% 0% -50% 0%",
    },
  });

  useScrollToHash({ containerRef: ref, sections });

  if (isFetching) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <div
      id="sections-container"
      ref={ref}
      className="overflow-y-auto scroll-smooth pb-32"
    >
      {sections
        .filter((s) => !emptySectionSlugs.has(s.slug))
        .map((s) => {
          const isOverview = s.order === OVERVIEW_SECTION_ORDER;
          return (
            <Section
              key={`section-container-${s.slug}`}
              isOverview={isOverview}
              data={s}
              menuItems={sections}
              emptySlugs={emptySectionSlugs}
            >
              {isOverview ? (
                <OverviewSection
                  widgets={s.baseWidgets}
                  tileMenuItems={tileMenuItems}
                />
              ) : (
                getVisibleWidgets(s.baseWidgets, filters).map((w) => (
                  <Widget
                    key={`widget-${w.indicator}`}
                    visualization={w.defaultVisualization}
                    visualisations={w.visualisations}
                    indicator={w.indicator}
                    description={w.description}
                    title={w.title}
                    section={s.name}
                    question={w.question}
                    questionTitle={w.questionTitle}
                    data={w.data as TransformedWidgetData}
                    responseRate={w.responseRate}
                    absoluteValue={w.absoluteValue}
                    className="lg:col-span-1 lg:last:odd:col-span-2"
                    config={{
                      menu: { className: "flex flex-col gap-6" },
                      pieChart: {
                        className: "aspect-square min-h-[200px] max-w-[400px]",
                        legendPosition: "right",
                      },
                      horizontalBarChart: { barSize: 47 },
                    }}
                    showCustomizeWidgetButton
                  />
                ))
              )}
            </Section>
          );
        })}
      <MoreInfoDialog />
    </div>
  );
}
