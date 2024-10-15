import { FC } from "react";

import Link from "next/link";

import { SectionWithDataWidget } from "@shared/dto/sections/section.entity";
import { useAtomValue } from "jotai";

import { cn } from "@/lib/utils";

import { intersectingAtom } from "@/containers/explore/store";
import SidebarAccordion from "@/containers/sidebar/sidebar-accordion";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ExploreSidebar: FC<{ sections?: SectionWithDataWidget[] }> = ({
  sections,
}) => {
  const intersecting = useAtomValue(intersectingAtom);

  return (
    <SidebarAccordion defaultValue={["explore-sections"]}>
      <AccordionItem value="explore-filters">
        <AccordionTrigger>Filters</AccordionTrigger>
        <AccordionContent className="py-3.5">filters here...</AccordionContent>
      </AccordionItem>
      <AccordionItem value="explore-sections">
        <AccordionTrigger>Sections</AccordionTrigger>
        <AccordionContent className="py-3.5" id="sidebar-sections-list">
          {sections?.map((s) => (
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
    </SidebarAccordion>
  );
};

export default ExploreSidebar;
