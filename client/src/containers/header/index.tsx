import { FC } from "react";

import { Menu as MenuIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Menu from "./menu";

const Header: FC = () => {
  return (
    <header className="flex items-center justify-between rounded-2xl bg-accent p-4">
      <h1 className="space-y-3 overflow-hidden whitespace-nowrap bg-logo bg-no-repeat indent-[100%] text-xl leading-none text-white">
        4Growth Visualization Platform
      </h1>

      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="rounded-full bg-foreground p-2 hover:bg-slate-200"
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
