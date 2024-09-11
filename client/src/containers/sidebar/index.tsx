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
  const currentPage = usePathname().startsWith("/sandbox")
    ? "sandbox"
    : "explore";
  let AccordionComponent = null;

  if (currentPage === "explore") {
    AccordionComponent = (
      <SidebarAccordion
        key="sidebar-accordion-explore"
        defaultValue={["explore-sections"]}
      >
        <AccordionItem value="explore-filters">
          <AccordionTrigger>Filters</AccordionTrigger>
          <AccordionContent>filters here...</AccordionContent>
        </AccordionItem>
        <AccordionItem value="explore-sections">
          <AccordionTrigger>Sections</AccordionTrigger>
          <AccordionContent></AccordionContent>
        </AccordionItem>
      </SidebarAccordion>
    );
  }

  if (currentPage === "sandbox") {
    AccordionComponent = (
      <SidebarAccordion
        key="sidebar-accordion-sandbox"
        defaultValue={["sandbox-settings", "sandbox-filters"]}
      >
        <AccordionItem value="sandbox-settings">
          <AccordionTrigger>Settings</AccordionTrigger>
          <AccordionContent>settings here...</AccordionContent>
        </AccordionItem>
        <AccordionItem value="sandbox-filters">
          <AccordionTrigger>Filters</AccordionTrigger>
          <AccordionContent>filters here...</AccordionContent>
        </AccordionItem>
      </SidebarAccordion>
    );
  }
  return (
    <>
      <Header />
      <div className="flex rounded-2xl bg-primary">
        <Button
          variant="transparent"
          className={cn(
            "w-full",
            currentPage === "explore" && "bg-white text-primary",
          )}
          asChild
        >
          <Link href="/explore">Explore</Link>
        </Button>
        <Button
          variant="transparent"
          className={cn(
            "w-full",
            currentPage === "sandbox" && "bg-white text-primary",
          )}
          asChild
        >
          <Link href="/sandbox">Sandbox</Link>
        </Button>
      </div>
      {AccordionComponent}
    </>
  );
};

export default Sidebar;
