import * as React from "react";
import { PropsWithChildren, useState } from "react";

import { cn } from "@/lib/utils";

import { QuestionMark } from "@/components/icons/question-mark";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogContentContainer,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function InfoButton({
  title,
  children,
  className,
}: PropsWithChildren<{
  title?: string;
  className?: string;
}>) {
  const [open, setOpen] = useState(false);

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
      <DialogContent
        className={cn(
          className,
          "max-h-[80%] overflow-auto bg-white text-navy-950",
        )}
      >
        <DialogHeader className="space-y-4">
          {title && <DialogTitle>{title}</DialogTitle>}
          <ScrollArea className="h-full">
            <DialogContentContainer>{children}</DialogContentContainer>
          </ScrollArea>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
