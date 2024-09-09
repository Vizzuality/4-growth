"use client";
import { FC } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import Header from "@/containers/header";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const Sidebar: FC = () => {
  const currentPage = usePathname().startsWith("/explore/sandbox/")
    ? "sandbox"
    : "explore";
  let AccordionComponent = null;

  if (currentPage === "explore") {
    AccordionComponent = (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Filters</AccordionTrigger>
          <AccordionContent>filters here...</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Sections</AccordionTrigger>
          <AccordionContent>sections here...</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  if (currentPage === "sandbox") {
    AccordionComponent = (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Settings</AccordionTrigger>
          <AccordionContent>settings here...</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Filters</AccordionTrigger>
          <AccordionContent>filters here...</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }
  return (
    <>
      <Header />
      <div className="flex rounded-2xl bg-primary">
        <Link className="flex-1" href="/explore">
          <Button
            variant="transparent"
            className={cn(
              "w-full",
              currentPage === "explore" && "bg-white text-primary",
            )}
          >
            Explore
          </Button>
        </Link>
        <Link className="flex-1" href="/explore/sandbox/1">
          <Button
            variant="transparent"
            className={cn(
              "w-full",
              currentPage === "sandbox" && "bg-white text-primary",
            )}
          >
            Sandbox
          </Button>
        </Link>
      </div>
      {AccordionComponent}
    </>
  );
};

export default Sidebar;
