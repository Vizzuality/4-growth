"use client";

import { FC, useState } from "react";

import { Menu as MenuIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Menu from "./menu";

const Header: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="flex items-center justify-between rounded-2xl bg-accent p-4">
      <div className="h-[72px] w-[160px] space-y-3 bg-logo bg-no-repeat">
        <h1 className="overflow-hidden whitespace-nowrap indent-[100%]">
          4Growth Visualisation Platform
        </h1>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-0 z-40 h-full w-full bg-navy-900/75" />
      )}

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
