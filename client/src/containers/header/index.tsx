"use client";

import { FC, useState } from "react";

import Link from "next/link";

import { Menu as MenuIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Overlay } from "@/components/ui/overlay";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getRouteHref } from "@/utils/route-config";

import Menu from "./menu";

const Header: FC<{ className?: string }> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      className={cn(
        "flex items-center justify-between rounded-2xl bg-accent p-4",
        className,
      )}
    >
      <Link href={getRouteHref("surveyAnalysis", "explore")}>
        <div className="h-[72px] w-[160px] space-y-3 bg-logo bg-no-repeat">
          <h1 className="overflow-hidden whitespace-nowrap indent-[100%]">
            4Growth Visualisation Platform
          </h1>
        </div>
      </Link>

      {isOpen && <Overlay />}

      <Popover onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="rounded-full bg-foreground p-2 outline-magenta-500 transition-colors hover:bg-white/80"
          >
            <MenuIcon className="h-4 w-4 text-magenta-500" />
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <Menu />
        </PopoverContent>
      </Popover>
    </header>
  );
};

export default Header;
