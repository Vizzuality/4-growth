"use client";

import { useEffect, useRef } from "react";

import { Section as SectionEntity } from "@shared/dto/sections/section.entity";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";

import Section from "@/containers/explore/section";

export default function Explore() {
  const { data } = client.sections.searchSections.useQuery(
    queryKeys.sections.all.queryKey,
    { query: {} },
    { select: (res) => res.body.data },
  );
  const sections = data as SectionEntity[];
  const ref = useRef<HTMLDivElement>(null);

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
      className="space-y-32 overflow-y-auto scroll-smooth pb-32"
    >
      {sections.map((s) => (
        <Section
          key={`section-container-${s.slug}`}
          data={s}
          menuItems={sections}
        ></Section>
      ))}
    </div>
  );
}
