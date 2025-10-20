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
          <DialogTitle>Best Viewed on Desktop</DialogTitle>
          <DialogDescription className="text-[#627188]">
            The platform is currently optimized for desktop viewing. For the
            best experience, please access it using a desktop or laptop. Some
            features may be limited or display differently on mobile devices.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DesktopViewDialog;
