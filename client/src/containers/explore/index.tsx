"use client";

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

  return (
    <div className="space-y-32 overflow-y-auto scroll-smooth pb-32">
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
