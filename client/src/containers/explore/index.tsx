"use client";

import { useEffect, useRef, useState } from "react";

import { SectionWithDataWidget } from "@shared/dto/sections/section.entity";
import { useSetAtom } from "jotai";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import Section from "@/containers/explore/section";
import OverviewSection from "@/containers/explore/section/overview-section";
import { intersectingAtom } from "@/containers/explore/store";
import Widget from "@/containers/widget";

import { Overlay } from "@/components/ui/overlay";

export default function Explore() {
  const { data } = client.sections.searchSections.useQuery(
    queryKeys.sections.all.queryKey,
    { query: {} },
    { select: (res) => res.body.data },
  );
  const sections = data as SectionWithDataWidget[];
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
      {sections.map((s, i) => (
        <Section
          key={`section-container-${s.slug}`}
          isOverview={i === 0}
          data={s}
          menuItems={sections}
        >
          {i === 0 && (
            <OverviewSection
              tileMenuItems={sections.map((s) => ({
                name: s.name,
                description: s.description,
                slug: s.slug,
              }))}
            />
          )}
          {s.baseWidgets.map((w) => (
            <Widget
              key={`widget-${w.id}`}
              indicator={w.indicator}
              question={w.question}
              visualisations={w.visualisations}
              defaultVisualization={w.defaultVisualization}
              data={w.data}
              className="col-span-1 last:odd:col-span-2"
              onMenuOpenChange={setShowOverlay}
            />
          ))}
        </Section>
      ))}
    </div>
  );
}
