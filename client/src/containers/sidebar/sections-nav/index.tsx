import { FC } from "react";

import Link from "next/link";

import { useAtomValue } from "jotai";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { cn, getSidebarLinkId } from "@/lib/utils";

import { intersectingAtom } from "@/containers/explore/store";

const SectionsNav: FC = () => {
  const sectionsQuery = client.sections.getSections.useQuery(
    queryKeys.sections.all([]).queryKey,
    { query: {} },
    { select: (res) => res.body.data },
  );
  const intersecting = useAtomValue(intersectingAtom);

  return (
    <nav aria-labelledby="sidebar-nav-title">
      <h2 id="sidebar-nav-title" className="sr-only">
        Sections navigation
      </h2>
      <ol role="list">
        {sectionsQuery.data?.map((s) => (
          <li key={`section-link-${s.slug}`} role="listitem">
            <Link
              className={cn(
                "block transition-colors hover:bg-secondary",
                intersecting === s.slug &&
                  "border-l-2 border-white bg-secondary",
              )}
              href={`#${s.slug}`}
              id={getSidebarLinkId(s.slug)}
              aria-controls={s.slug}
              aria-current={intersecting === s.slug ? "true" : undefined}
            >
              <div className="px-4 py-3.5">{s.name}</div>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default SectionsNav;
