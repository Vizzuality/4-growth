"use client";

import { useMemo, useRef } from "react";

import { SectionWithDataWidget } from "@shared/dto/sections/section.entity";
import { useSetAtom } from "jotai";

import {
  getAbsoluteValue,
  getResponseRate,
  normalizeWidgetData,
} from "@/lib/normalize-widget-data";
import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import useFilters from "@/hooks/use-filters";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";

import MoreInfoDialog from "@/containers/dialog/more-info";
import Section from "@/containers/explore/section";
import OverviewSection from "@/containers/explore/section/overview-section";
import { intersectingAtom } from "@/containers/explore/store";
import Widget from "@/containers/widget/survey-analysis";

import { Spinner } from "@/components/ui/spinner";
import { TransformedWidget, TransformedWidgetData } from "@/types";
import { useScrollSpy } from "tests/hooks/use-scroll-spy";

export default function Explore() {
  const { filters } = useFilters();
  const { data, isFetching } = client.sections.getSections.useQuery(
    queryKeys.sections.all(filters).queryKey,
    { query: { filters } },
    {
      select: (res) =>
        res.body.data.map((d) => ({
          ...d,
          baseWidgets: d.baseWidgets?.map((w) => ({
            ...w,
            data: {
              raw: w.data,
              percentages: normalizeWidgetData(w.data),
            },
            responseRate: getResponseRate(w.data),
            absoluteValue: getAbsoluteValue(w.data),
          })),
        })),
    },
  );
  const sections = useMemo(
    () =>
      (data as (SectionWithDataWidget & {
        baseWidgets: TransformedWidget[];
      })[]) || [],
    [data],
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
      {sections.map((s) => {
        const isOverview = s.order === 1;
        return (
          <Section
            key={`section-container-${s.slug}`}
            isOverview={isOverview}
            data={s}
            menuItems={sections}
          >
            {isOverview ? (
              <OverviewSection
                widgets={s.baseWidgets}
                tileMenuItems={sections.map((s) => ({
                  name: s.name,
                  description: s.description,
                  slug: s.slug,
                }))}
              />
            ) : (
              s.baseWidgets.map((w) => (
                <Widget
                  key={`widget-${w.indicator}`}
                  visualization={w.defaultVisualization}
                  visualisations={w.visualisations}
                  indicator={w.indicator}
                  description={w.description}
                  title={w.title}
                  question={w.question}
                  questionTitle={w.questionTitle}
                  data={w.data as TransformedWidgetData}
                  responseRate={w.responseRate}
                  absoluteValue={w.absoluteValue}
                  className="md:col-span-1 md:last:odd:col-span-2"
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
