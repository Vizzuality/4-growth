import { FC } from "react";

import Link from "next/link";

import { useAtomValue } from "jotai";

import { cn, getInPageLinkId } from "@/lib/utils";

import { intersectingAtom } from "@/containers/explore/store";

import { Card } from "@/components/ui/card";
import Title from "@/components/ui/title";

export interface TileMenuItem {
  name: string;
  description: string;
  slug: string;
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
      className={cn("grid grid-cols-3 gap-0.5", className)}
    >
      <h2 id="in-page-nav-title" className="sr-only">
        Sections navigation
      </h2>
      {items.map((i) => (
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
      ))}
    </nav>
  );
};

export default TileMenu;
