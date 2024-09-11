"use client";
import { FC } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import Header from "@/containers/header";
import SidebarAccordion from "@/containers/sidebar/sidebar-accordion";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const Sidebar: FC = () => {
  const isExplore = usePathname().startsWith("/explore");

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
              <AccordionContent>filters here...</AccordionContent>
            </AccordionItem>
            <AccordionItem value="explore-sections">
              <AccordionTrigger>Sections</AccordionTrigger>
              <AccordionContent></AccordionContent>
            </AccordionItem>
          </>
        ) : (
          <>
            <AccordionItem value="sandbox-settings">
              <AccordionTrigger>Settings</AccordionTrigger>
              <AccordionContent>settings here...</AccordionContent>
            </AccordionItem>
            <AccordionItem value="sandbox-filters">
              <AccordionTrigger>Filters</AccordionTrigger>
              <AccordionContent>filters here...</AccordionContent>
            </AccordionItem>
          </>
        )}
      </SidebarAccordion>
    </>
  );
};

export default Sidebar;
