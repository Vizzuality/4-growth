"use client";

import { useEffect, useRef, useState } from "react";

import { Section as SectionEntity } from "@shared/dto/sections/section.entity";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import Section from "@/containers/explore/section";
import OverviewSection from "@/containers/explore/section/overview-section";
import Widget from "@/containers/widget";

import { Overlay } from "@/components/ui/overlay";

export default function Explore() {
  const { data } = client.sections.searchSections.useQuery(
    queryKeys.sections.all.queryKey,
    { query: {} },
    { select: (res) => res.body.data },
  );
  const sections = data as SectionEntity[];
  const ref = useRef<HTMLDivElement>(null);
  const [showOverlay, setShowOverlay] = useState(false);

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
          {i === 0 && <OverviewSection />}
          {i === 1 && (
            <div className="grid grid-cols-2 gap-0.5">
              <Widget
                indicator="Organization size"
                question="What is the size of your agriculture or forestry organization in terms of workforce?"
                visualisations={["horizontal_bar_chart", "pie_chart"]}
                defaultVisualization="horizontal_bar_chart"
                data={[
                  { label: "Label", value: 15, total: 15 },
                  { label: "Label", value: 13, total: 13 },
                  { label: "Label", value: 45, total: 45 },
                  { label: "Label", value: 13, total: 13 },
                ]}
                className="col-span-1 last:odd:col-span-2"
                onMenuOpenChange={setShowOverlay}
              />
              <Widget
                indicator="Data sharing"
                question="Do you share this data?"
                visualisations={["area_graph", "pie_chart"]}
                defaultVisualization="area_graph"
                data={[
                  { label: "Yes", value: 15, total: 15 },
                  { label: "No", value: 25, total: 25 },
                  { label: "Don't know", value: 60, total: 60 },
                ]}
                className="col-span-1 last:odd:col-span-2"
                onMenuOpenChange={setShowOverlay}
              />
              <Widget
                indicator="Experience level"
                question="What is the general level of work experience in your organisation?"
                visualisations={["horizontal_bar_chart", "pie_chart"]}
                defaultVisualization="pie_chart"
                data={[
                  { label: "Mid-level professionals", value: 72, total: 72 },
                  { label: "Experts", value: 15, total: 15 },
                  { label: "Early-career/Entry level", value: 13, total: 13 },
                  { label: "Middled-aged (25-50)", value: 13, total: 13 },
                ]}
                className="col-span-1 last:odd:col-span-2"
                onMenuOpenChange={setShowOverlay}
              />
              <Widget
                indicator="Socio-economic benefits"
                question="Have you experienced socio-economic benefits through the use of digital technologies?"
                visualisations={[
                  "pie_chart",
                  "area_graph",
                  "horizontal_bar_chart",
                ]}
                defaultVisualization="area_graph"
                data={[
                  { label: "Yes", value: 32, total: 32 },
                  { label: "No", value: 48, total: 48 },
                  { label: "Don't know", value: 20, total: 20 },
                ]}
                className="col-span-1 last:odd:col-span-2"
                onMenuOpenChange={setShowOverlay}
              />
              <Widget
                indicator="Socio-economic benefits"
                question="Have you experienced socio-economic benefits through the use of digital technologies?"
                visualisations={[
                  "pie_chart",
                  "area_graph",
                  "horizontal_bar_chart",
                ]}
                defaultVisualization="area_graph"
                data={[
                  { label: "Yes", value: 32, total: 32 },
                  { label: "No", value: 48, total: 48 },
                  { label: "Don't know", value: 20, total: 20 },
                ]}
                className="col-span-1 last:odd:col-span-2"
                onMenuOpenChange={setShowOverlay}
              />
            </div>
          )}
        </Section>
      ))}
    </div>
  );
}
