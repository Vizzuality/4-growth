"use client";
import { FC } from "react";

import SandboxSettings from "@/containers/sidebar/projections-sidebar/sandbox-settings";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
      <SheetContent
        className="h-full max-h-[80%] w-screen rounded-t-2xl border-t-navy-900 bg-navy-900 px-0 pb-0"
        side="bottom"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="px-4 text-left text-base">Settings</SheetTitle>
          <SheetDescription className="sr-only">Settings</SheetDescription>
        </SheetHeader>
        <div className="py-3.5">
          <SandboxSettings />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsSheet;
