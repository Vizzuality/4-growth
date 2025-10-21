"use client";
import { FC } from "react";

import SandboxSettings from "@/containers/sidebar/projections-sidebar/sandbox-settings";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const SettingsSheet: FC = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="w-full">Settings</Button>
      </SheetTrigger>
      <SheetContent className="h-full w-screen bg-navy-900" side="bottom">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="py-3.5">
          <SandboxSettings />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsSheet;
