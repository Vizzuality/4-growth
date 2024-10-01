"use client";
import { PropsWithChildren, useState } from "react";

import { useRouter } from "next/navigation";

import { Section as SectionEntity } from "@shared/dto/sections/section.entity";

import SectionNavigator from "@/components/icons/section-navigator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SectionProps {
  data: SectionEntity;
  menuItems: SectionEntity[];
  isOverview: boolean;
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
      className="mb-16 grid gap-0.5"
      id={slug}
      data-testid="section-container"
    >
      {isOverview ? (
        <div className="grid grid-cols-2 gap-0.5">
          <Card className="space-y-4 bg-secondary">
            <h2 className="text-xl font-semibold">{name}</h2>
            <p className="text-muted-foreground">{description}</p>
          </Card>
          <Card className="bg-lightgray bg-[url('/images/explore/overview-widget-bg.avif')] bg-cover bg-center bg-no-repeat" />
        </div>
      ) : (
        <header className="flex justify-between space-y-4 rounded-2xl bg-secondary p-6">
          <div>
            <h2 className="text-xl font-semibold">{name}</h2>
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
      {children}
    </section>
  );
};

export default Section;
