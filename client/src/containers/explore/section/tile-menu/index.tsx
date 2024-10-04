import { FC } from "react";

import Link from "next/link";

import { cn } from "@/lib/utils";

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
  return (
    <div className={cn("grid grid-cols-3 gap-0.5", className)}>
      {items.map((i) => (
        <Card
          key={`tile-menu-${i.slug}`}
          className="space-y-6 bg-primary p-0 transition-colors hover:bg-secondary"
        >
          <Link className="flex-1 p-6" href={"#" + i.slug}>
            <Title as="h3" className="text-base">
              {i.name}
            </Title>
            <p className="text-xs text-muted-foreground">{i.description}</p>
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default TileMenu;
