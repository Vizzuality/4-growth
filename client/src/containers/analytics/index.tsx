"use client";

import { useEffect, useState } from "react";

import { GoogleAnalytics } from "@next/third-parties/google";
import { useAtomValue } from "jotai";

import { analyticsConsentAtom } from "@/app/store";

const Analytics = () => {
  const [mounted, setMounted] = useState(false);
  const analyticsConsent = useAtomValue(analyticsConsentAtom);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !analyticsConsent) {
    return null;
  }

  return (
    <>
      {!!process.env.NEXT_PUBLIC_GA_TRACKING_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_TRACKING_ID} />
      )}
    </>
  );
};

export default Analytics;
