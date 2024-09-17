"use client";
import { FC } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAtomValue } from "jotai";

import { client } from "@/lib/queryClient";
import { queryKeys } from "@/lib/queryKeys";
import { cn } from "@/lib/utils";

import { intersectingAtom } from "@/containers/explore/store";
import Header from "@/containers/header";
import SidebarAccordion from "@/containers/sidebar/sidebar-accordion";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const Sidebar: FC = () => {
  const { data } = client.sections.searchSections.useQuery(
    queryKeys.sections.all.queryKey,
    { query: {} },
    { select: (res) => res.body.data },
  );
  const isExplore = usePathname().startsWith("/explore");
  const intersecting = useAtomValue(intersectingAtom);

  return (
    <>
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
      <SidebarAccordion
        defaultValue={
          isExplore
            ? ["explore-sections"]
            : ["sandbox-settings", "sandbox-filters"]
        }
      >
        {isExplore ? (
          <>
            <AccordionItem value="explore-filters">
              <AccordionTrigger>Filters</AccordionTrigger>
              <AccordionContent className="py-3.5">
                filters here...
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="explore-sections">
              <AccordionTrigger>Sections</AccordionTrigger>
              <AccordionContent className="py-3.5">
                {data?.map((s) => (
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
          </>
        ) : (
          <>
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
          </>
        )}
      </SidebarAccordion>
    </>
  );
};

export default Sidebar;
