import { FC } from "react";

import ScenariosSelector from "@/containers/scenarios/selector";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const ScenariosSheet: FC = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="w-full">Scenarios</Button>
      </SheetTrigger>
      <SheetContent className="h-full w-screen bg-navy-900" side="bottom">
        <SheetHeader className="mb-4">
          <SheetTitle>Scenarios</SheetTitle>
        </SheetHeader>
        <ScenariosSelector />
      </SheetContent>
    </Sheet>
  );
};

export default ScenariosSheet;
