"use client";

import { useEffect, useRef, useState } from "react";

import { SectionWithDataWidget } from "@shared/dto/sections/section.entity";
import { useSetAtom } from "jotai";

import { normalizeWidgetData } from "@/lib/normalize-widget-data";
import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import useFilters from "@/hooks/useFilters";

import Section from "@/containers/explore/section";
import OverviewSection from "@/containers/explore/section/overview-section";
import { intersectingAtom } from "@/containers/explore/store";
import Widget from "@/containers/widget";

import { Overlay } from "@/components/ui/overlay";

export default function Explore() {
  const { filters } = useFilters();
  const { data } = client.sections.getSections.useQuery(
    queryKeys.sections.all(filters).queryKey,
    { query: { filters } },
    {
      select: (res) =>
        res.body.data.map((d) => ({
          ...d,
          baseWidgets: d.baseWidgets?.map((w) => ({
            ...w,
            data: normalizeWidgetData(w.data),
          })),
        })),
    },
  );
  const sections = (data as SectionWithDataWidget[]) || [];
  const ref = useRef<HTMLDivElement>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const setIntersecting = useSetAtom(intersectingAtom);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionSlug = entry.target.id;

            setIntersecting(sectionSlug);
          }
        });
      },
      {
        root: ref.current,
        threshold: 0,
        /**
         * This rootMargin creates a horizontal line vertically centered
         * that will help trigger an intersection at that the very point.
         */
        rootMargin: "-50% 0% -50% 0%",
      },
    );

    const sections = Array.from(ref.current.children);
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [ref.current, setIntersecting]);

  useEffect(() => {
    // TODO: This check can be removed if the api response is fixed,
    // i.e. the api should always return all sections and only filter the widget data
    if (sections.length === 0) return;

    const handlePopState = () => {
      const hash = window.location.hash.slice(1);
      const id = decodeURIComponent(hash || sections[0].slug);
      const element = document.getElementById(id);

      if (element && ref.current) {
        const containerRect = ref.current.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const scrollTop =
          elementRect.top - containerRect.top + ref.current.scrollTop;

        ref.current.scrollTo({
          top: scrollTop,
        });
      }
    };

    window.addEventListener("popstate", handlePopState);

    handlePopState();
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [sections]);

  return (
    <div
      id="sections-container"
      ref={ref}
      className="overflow-y-auto scroll-smooth pb-32"
    >
      {showOverlay && <Overlay />}
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
                  indicator={w.indicator}
                  question={w.question}
                  visualisations={w.visualisations}
                  defaultVisualization={w.defaultVisualization}
                  data={w.data}
                  className="col-span-1 last:odd:col-span-2"
                  onMenuOpenChange={setShowOverlay}
                />
              ))
            )}
          </Section>
        );
      })}
    </div>
  );
}
