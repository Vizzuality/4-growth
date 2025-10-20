"use client";

import { FC, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DesktopViewDialog: FC = () => {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-[600px] bg-white text-popover-foreground">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-[24px]">
            Best viewed on desktop
          </DialogTitle>
          <DialogDescription className="text-[#627188]">
            The platform is optimized for larger screens. Some features may be
            limited on smaller devices. The mobile version will be available
            soon.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DesktopViewDialog;
