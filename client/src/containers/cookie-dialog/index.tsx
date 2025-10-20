"use client";

import { FC } from "react";

import { useAtom } from "jotai";

import { analyticsConsentAtom } from "@/app/store";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CookieDialog: FC = () => {
  const [analyticsConsent, setAnalyticsConsent] = useAtom(analyticsConsentAtom);

  if (
    !process.env.NEXT_PUBLIC_GA_TRACKING_ID ||
    analyticsConsent !== undefined
  ) {
    return null;
  }

  return (
    <Dialog open onOpenChange={() => setAnalyticsConsent(false)}>
      <DialogContent className="w-full max-w-[600px] bg-white text-popover-foreground">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-[24px]">Analytics cookies</DialogTitle>
          <DialogDescription className="text-[#627188]">
            We use cookies for technical purposes and to analyze traffic with
            Google Analytics. The essential cookies always need to be on because
            they are necessary for core functionality.
          </DialogDescription>
        </DialogHeader>
        <div className="flex shrink-0 flex-col items-center gap-2 md:flex-row">
          <Button
            type="button"
            className="w-full md:w-auto"
            onClick={() => setAnalyticsConsent(true)}
          >
            Accept all cookies
          </Button>
          <Button
            type="button"
            className="w-full md:w-auto"
            onClick={() => setAnalyticsConsent(false)}
          >
            Reject non-essential cookies
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CookieDialog;
