"use client";
import { PropsWithChildren, useState } from "react";

import { useRouter } from "next/navigation";

import { Section as SectionEntity } from "@shared/dto/sections/section.entity";

import { getInPageLinkId, getSidebarLinkId } from "@/lib/utils";

import SectionNavigator from "@/components/icons/section-navigator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Title from "@/components/ui/title";

interface SectionProps {
  data: SectionEntity;
  menuItems: SectionEntity[];
  isOverview?: boolean;
}

const POPOVER_ID = "sections-menu-popover";
const Section: React.FC<PropsWithChildren<SectionProps>> = ({
  data,
  menuItems,
  isOverview,
  children,
}) => {
  const { slug, name, description } = data;
  const [popoverOpen, setPopOverOpen] = useState(false);
  const router = useRouter();

  const handleLinkClick = (sectionId: string) => {
    setPopOverOpen(false);

    // Scroll to anchor tag only works properly after popup is removed from the DOM:
    const checkPopoverRemoved = () => {
      if (!document.getElementById(POPOVER_ID)) {
        router.push(`#${sectionId}`);
      } else {
        requestAnimationFrame(checkPopoverRemoved);
      }
    };

    requestAnimationFrame(checkPopoverRemoved);
  };

  return (
    <section
      className="mb-16"
      id={slug}
      aria-labelledby={`${getSidebarLinkId(slug)} ${getInPageLinkId(slug)}`}
    >
      {isOverview ? (
        <div className="mb-0.5 grid grid-cols-1 grid-rows-[auto_250px] gap-0.5 lg:col-span-2 lg:grid-cols-2 lg:grid-rows-1">
          <Card className="space-y-4 bg-secondary">
            <Title as="h2" className="text-xl">
              {name}
            </Title>
            <p className="text-muted-foreground">{description}</p>
          </Card>
          <Card className="bg-lightgray bg-[url('/images/explore/overview-widget-bg.avif')] bg-cover bg-center bg-no-repeat" />
        </div>
      ) : (
        <header className="mb-0.5 flex justify-between space-y-4 rounded-2xl bg-secondary p-6">
          <div>
            <Title as="h2" className="text-xl">
              {name}
            </Title>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <Popover open={popoverOpen} onOpenChange={setPopOverOpen}>
            <PopoverTrigger asChild id="section-nav">
              <Button type="button" variant="default" className="p-0">
                <div className="flex items-center justify-center">
                  <SectionNavigator className="h-8 w-8" />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" id={POPOVER_ID}>
              {menuItems.map((s) => (
                <Button
                  key={`menu-item-${s.slug}`}
                  variant="clean"
                  className="block w-full p-4 text-left text-xs hover:bg-primary-foreground"
                  onClick={() => {
                    handleLinkClick(s.slug);
                  }}
                >
                  {s.name}
                </Button>
              ))}
            </PopoverContent>
          </Popover>
        </header>
      )}
      <div className="grid grid-cols-1 gap-0.5 lg:grid-cols-2">{children}</div>
    </section>
  );
};

export default Section;
