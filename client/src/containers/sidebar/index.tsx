"use client";
import { FC, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAtomValue } from "jotai";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { cn } from "@/lib/utils";

import { intersectingAtom } from "@/containers/explore/store";
import FilterSelect from "@/containers/filter/filter-select";
import Header from "@/containers/header";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Overlay } from "@/components/ui/overlay";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

const DEFAULT_FILTERS = ["eu-member-state", "type-of-data"];
const POPOVER_CONTENT_CLASS = "ml-4 h-[320px] w-full min-w-[320px]";

const Sidebar: FC = () => {
  const sectionsQuery = client.sections.searchSections.useQuery(
    queryKeys.sections.all.queryKey,
    { query: {} },
    { select: (res) => res.body.data },
  );
  const filtersQuery = client.pageFilter.searchFilters.useQuery(
    queryKeys.pageFilters.all.queryKey,
    {},
    { select: (res) => res.body.data },
  );
  const isExplore = usePathname().startsWith("/explore");
  const intersecting = useAtomValue(intersectingAtom);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <>
      {isPopoverOpen && <Overlay />}
      <Header />
      <div className="rounded-2xl bg-primary">
        <Button
          variant="clean"
          className={cn("w-full", isExplore && "bg-white text-primary")}
          asChild
        >
          <Link href="/explore">Explore</Link>
        </Button>
        <Button
          variant="clean"
          className={cn("w-full", !isExplore && "bg-white text-primary")}
          asChild
        >
          <Link href="/sandbox">Sandbox</Link>
        </Button>
      </div>
      <ScrollArea>
        {isExplore ? (
          <Accordion
            key="sidebar-accordion-explore"
            type="multiple"
            className="w-full overflow-y-auto"
            defaultValue={["explore-sections"]}
          >
            <AccordionItem value="explore-filters">
              <AccordionTrigger>Filters</AccordionTrigger>
              <AccordionContent className="py-3.5">
                {filtersQuery.data
                  ?.filter((pageFilter) =>
                    DEFAULT_FILTERS.includes(pageFilter.name),
                  )
                  .map((f) => (
                    <Popover
                      key={`sidebar-filter-popover-${f.name}`}
                      onOpenChange={setIsPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="clean"
                          className="w-full justify-start rounded-none px-4 py-3.5 font-normal transition-colors hover:bg-secondary"
                        >
                          {f.name}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="end"
                        side="bottom"
                        className={POPOVER_CONTENT_CLASS}
                      >
                        <FilterSelect
                          items={filtersQuery.data || []}
                          fixedFilter={f}
                          onSubmit={() => {
                            // TODO: implemenation will be added in seperate PR
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  ))}
                <Popover onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="clean"
                      className="w-full justify-start rounded-none px-4 py-3.5 font-normal transition-colors hover:bg-secondary"
                    >
                      Add a custom filter
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    side="bottom"
                    className={POPOVER_CONTENT_CLASS}
                  >
                    <FilterSelect
                      items={filtersQuery.data || []}
                      onSubmit={() => {
                        // TODO: implemenation will be added in seperate PR
                      }}
                    />
                  </PopoverContent>
                </Popover>

                <Button
                  variant="clean"
                  className="w-full justify-start rounded-none px-4 py-3.5 font-normal transition-colors hover:bg-secondary"
                >
                  Add a data breakdown
                </Button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="explore-sections">
              <AccordionTrigger>Sections</AccordionTrigger>
              <AccordionContent className="py-3.5" id="sidebar-sections-list">
                {sectionsQuery.data?.map((s) => (
                  <Link
                    key={`section-link-${s.slug}`}
                    className={cn(
                      "block transition-colors hover:bg-secondary",
                      intersecting === s.slug &&
                        "border-l-2 border-white bg-secondary",
                    )}
                    href={`#${s.slug}`}
                  >
                    <div className="px-4 py-3.5">{s.name}</div>
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <Accordion
            key="sidebar-accordion-sandbox"
            type="multiple"
            className="w-full overflow-y-auto"
            defaultValue={["sandbox-settings", "sandbox-filters"]}
          >
            <AccordionItem value="sandbox-settings">
              <AccordionTrigger>Settings</AccordionTrigger>
              <AccordionContent className="py-3.5">
                settings here...
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="sandbox-filters">
              <AccordionTrigger>Filters</AccordionTrigger>
              <AccordionContent className="py-3.5">
                filters here...
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </ScrollArea>
    </>
  );
};

export default Sidebar;
