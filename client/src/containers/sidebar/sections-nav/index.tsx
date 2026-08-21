import { FC } from "react";

import Link from "next/link";

import { useAtomValue } from "jotai";

import { SECTION_UNAVAILABLE_REASON } from "@/lib/constants";
import { normalizeSections } from "@/lib/normalize-widget-data";
import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { cn, getSidebarLinkId } from "@/lib/utils";
import { getEmptySectionSlugs } from "@/lib/widget-visibility";

import useFilters from "@/hooks/use-filters";

import { intersectingAtom } from "@/containers/explore/store";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SectionsNav: FC = () => {
  const { filters } = useFilters();
  // Same key and filters as the explore page, so the two read one cache entry and
  // cannot disagree about which sections have data.
  const sectionsQuery = client.sections.getSections.useQuery(
    queryKeys.sections.all(filters).queryKey,
    { query: { filters } },
    {
      select: (res) => normalizeSections(res.body.data),
      keepPreviousData: true,
    },
  );
  const intersecting = useAtomValue(intersectingAtom);
  const sections = sectionsQuery.data ?? [];
  const emptySectionSlugs = getEmptySectionSlugs(sections, filters);

  return (
    <nav aria-labelledby="sidebar-nav-title">
      <h2 id="sidebar-nav-title" className="sr-only">
        Sections navigation
      </h2>
      <ol role="list">
        {sections.map((s) => (
          <li key={`section-link-${s.slug}`} role="listitem">
            {emptySectionSlugs.has(s.slug) ? (
              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <div
                      className="cursor-not-allowed px-4 py-3.5 text-slate-400 opacity-60"
                      id={getSidebarLinkId(s.slug)}
                      tabIndex={0}
                      aria-disabled="true"
                      aria-describedby={`section-link-${s.slug}-reason`}
                    >
                      {s.name}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    align="start"
                    side="right"
                    className="max-w-64 rounded-lg border-none bg-popover-foreground px-2 py-1 text-2xs text-white"
                  >
                    <p>{SECTION_UNAVAILABLE_REASON}</p>
                  </TooltipContent>
                </Tooltip>
                <span id={`section-link-${s.slug}-reason`} className="sr-only">
                  {SECTION_UNAVAILABLE_REASON}
                </span>
              </TooltipProvider>
            ) : (
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
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default SectionsNav;
