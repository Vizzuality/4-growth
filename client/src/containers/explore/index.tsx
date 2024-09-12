"use client";
import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { parseSearchSectionsQuery } from "@/lib/utils";

import Section from "@/containers/explore/section";

export default function Explore() {
  const { data } = client.sections.searchSections.useQuery(
    queryKeys.sections.all.queryKey,
    { query: {} },
    { select: parseSearchSectionsQuery },
  );

  return (
    <div className="space-y-32 overflow-y-auto scroll-smooth pb-32">
      {data?.map((s) => (
        <Section id={s.id} key={`section-container-${s.id}`}>
          <h2 className="text-xl">{s.name}</h2>
          <p>{s.description}</p>
        </Section>
      ))}
    </div>
  );
}
