import { FC } from "react";

import Link from "next/link";

import { Card } from "@/components/ui/card";

interface TileMenuProps {
  items: { title: string; description: string; href: string }[];
}

const TileMenu: FC<TileMenuProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-3 gap-0.5">
      {items.map((i) => (
        <Link key={`tile-menu-${i.href}`} href={i.href}>
          <Card className="space-y-6 bg-primary p-6 transition-colors hover:bg-secondary">
            <h3 className="font-semibold">{i.title}</h3>
            <p className="text-muted-foreground">{i.description}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default TileMenu;
