import { FC } from "react";

import Link from "next/link";

import { useAtomValue } from "jotai";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { cn } from "@/lib/utils";

import { intersectingAtom } from "@/containers/explore/store";

const SectionsNav: FC = () => {
  const sectionsQuery = client.sections.getSections.useQuery(
    queryKeys.sections.all([]).queryKey,
    { query: {} },
    { select: (res) => res.body.data },
  );
  const intersecting = useAtomValue(intersectingAtom);

  return (
    <>
      {sectionsQuery.data?.map((s) => (
        <Link
          key={`section-link-${s.slug}`}
          className={cn(
            "block transition-colors hover:bg-secondary",
            intersecting === s.slug && "border-l-2 border-white bg-secondary",
          )}
          href={`#${s.slug}`}
        >
          <div className="px-4 py-3.5">{s.name}</div>
        </Link>
      ))}
    </>
  );
};

export default SectionsNav;
