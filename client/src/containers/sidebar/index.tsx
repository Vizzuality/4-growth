"use client";
import { FC } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAtomValue } from "jotai";

import { cn } from "@/lib/utils";

import useFilters from "@/hooks/useFilters";

import Header from "@/containers/header";
import FilterSettings from "@/containers/sidebar/filter-settings";
import SectionsNav from "@/containers/sidebar/sections-nav";
import { isPopoverOpenAtom } from "@/containers/sidebar/store";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Overlay } from "@/components/ui/overlay";
import { ScrollArea } from "@/components/ui/scroll-area";

const Sidebar: FC = () => {
  const isExplore = usePathname().startsWith("/explore");
  const isPopoverOpen = useAtomValue(isPopoverOpenAtom);
  const { filters } = useFilters();

  return (
    <>
      {isPopoverOpen && <Overlay />}
      <Header />
      <div className="flex rounded-2xl bg-primary">
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
            defaultValue={
              filters.length
                ? ["explore-filters", "explore-sections"]
                : ["explore-sections"]
            }
          >
            <AccordionItem value="explore-filters">
              <AccordionTrigger>Filters</AccordionTrigger>
              <AccordionContent className="py-3.5">
                <FilterSettings />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="explore-sections">
              <AccordionTrigger>Sections</AccordionTrigger>
              <AccordionContent className="py-3.5" id="sidebar-sections-list">
                <SectionsNav />
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
                <FilterSettings />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </ScrollArea>
    </>
  );
};

export default Sidebar;
