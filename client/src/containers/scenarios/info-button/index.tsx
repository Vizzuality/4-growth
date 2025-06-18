import * as React from "react";
import { FC, PropsWithChildren } from "react";

import { useAtom } from "jotai";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

import { showScenarioInfoAtom } from "@/app/(root)/projections/store";

import { QuestionMark } from "@/components/icons/question-mark";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const ScenarioInfoButton: FC<PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = useAtom(showScenarioInfoAtom);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          role="button"
          onClick={() => {
            setOpen(true);
          }}
          className={cn(
            buttonVariants({
              variant: "info",
            }),
            "h-8 w-8 p-0",
          )}
        >
          <QuestionMark />
        </div>
      </DialogTrigger>
      <DialogContent className="overflow-auto bg-white px-0 pb-0 text-navy-950 [&>button]:hidden">
        <ScrollArea className="h-full px-4">
          <DialogHeader className="mb-4 flex w-full flex-row items-start justify-between px-4">
            <DialogTitle className="text-xl">Scenario</DialogTitle>
            <Button className="p-2" size="none" onClick={() => setOpen(false)}>
              <X className="h-4 w-4 text-white" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogHeader>
          <div className="h-[600px]">
            <div className="pb-6">{children}</div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ScenarioInfoButton;
