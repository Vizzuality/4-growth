"use client";
import { FC, useState } from "react";

import ScenariosSelector from "@/containers/scenarios/selector";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const ScenariosSheet: FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="w-full">Scenarios</Button>
      </SheetTrigger>
      <SheetContent
        className="h-full max-h-[80%] w-screen rounded-t-2xl border-t-navy-900 bg-navy-900 px-0 pb-0"
        side="bottom"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="px-4 text-left text-base">
            Scenarios
          </SheetTitle>
          <SheetDescription className="sr-only">Scenarios</SheetDescription>
        </SheetHeader>
        <ScenariosSelector onToggleScenario={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
};

export default ScenariosSheet;
