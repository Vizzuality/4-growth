import { FC } from "react";

import Link from "next/link";

import { useAtomValue } from "jotai";

import { SECTION_UNAVAILABLE_REASON } from "@/lib/constants";
import { cn, getInPageLinkId } from "@/lib/utils";

import { intersectingAtom } from "@/containers/explore/store";

import { Card } from "@/components/ui/card";
import Title from "@/components/ui/title";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface TileMenuItem {
  name: string;
  description: string;
  slug: string;
  isEmpty?: boolean;
}
interface TileMenuProps {
  items: TileMenuItem[];
  className?: string;
}

const TileMenu: FC<TileMenuProps> = ({ items, className }) => {
  const intersecting = useAtomValue(intersectingAtom);

  return (
    <nav
      id="in-page-sections-list"
      aria-labelledby="in-page-nav-title"
      className={cn("grid grid-cols-2 gap-0.5 md:grid-cols-3", className)}
    >
      <h2 id="in-page-nav-title" className="sr-only">
        Sections navigation
      </h2>
      {items.map((i) =>
        i.isEmpty ? (
          <TooltipProvider key={`tile-menu-${i.slug}`}>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Card className="space-y-6 bg-primary p-0 opacity-60">
                  <div
                    className="flex-1 cursor-not-allowed p-6"
                    id={getInPageLinkId(i.slug)}
                    tabIndex={0}
                    aria-disabled="true"
                    aria-describedby={`tile-menu-${i.slug}-reason`}
                  >
                    <Title as="h3" className="text-base">
                      {i.name}
                    </Title>
                    <p className="text-xs text-muted-foreground">
                      {i.description}
                    </p>
                  </div>
                </Card>
              </TooltipTrigger>
              <TooltipContent
                align="start"
                className="max-w-64 rounded-lg border-none bg-popover-foreground px-2 py-1 text-2xs text-white"
              >
                <p>{SECTION_UNAVAILABLE_REASON}</p>
              </TooltipContent>
            </Tooltip>
            <span id={`tile-menu-${i.slug}-reason`} className="sr-only">
              {SECTION_UNAVAILABLE_REASON}
            </span>
          </TooltipProvider>
        ) : (
          <Card
            key={`tile-menu-${i.slug}`}
            className="space-y-6 bg-primary p-0 transition-colors hover:bg-secondary"
          >
            <Link
              className="flex-1 p-6"
              href={`#${i.slug}`}
              id={getInPageLinkId(i.slug)}
              aria-controls={i.slug}
              aria-current={intersecting === i.slug ? "true" : undefined}
            >
              <Title as="h3" className="text-base">
                {i.name}
              </Title>
              <p className="text-xs text-muted-foreground">{i.description}</p>
            </Link>
          </Card>
        ),
      )}
    </nav>
  );
};

export default TileMenu;
