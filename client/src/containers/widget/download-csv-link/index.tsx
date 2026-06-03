"use client";

import { AnchorHTMLAttributes, forwardRef } from "react";

import { sendGAEvent } from "@next/third-parties/google";
import { useAtomValue } from "jotai";

import { analyticsConsentAtom } from "@/app/store";

import { slugify } from "@/lib/slugify";

const NOT_AVAILABLE = "not_available";

export interface DownloadCsvLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  downloadUrl: string;
  chartId?: string;
  chartTitle?: string;
  section?: string;
}

const DownloadCsvLink = forwardRef<HTMLAnchorElement, DownloadCsvLinkProps>(
  (
    { downloadUrl, chartId, chartTitle, section, children, ...anchorProps },
    ref,
  ) => {
    const analyticsConsent = useAtomValue(analyticsConsentAtom);

    const handleClick = () => {
      if (!analyticsConsent) return;

      const slug = chartTitle ? slugify(chartTitle) : "";

      sendGAEvent("event", "visualisation_csv_download", {
        chart_id: chartId || NOT_AVAILABLE,
        chart_title: chartTitle || NOT_AVAILABLE,
        section: section || NOT_AVAILABLE,
        file_name: slug ? `${slug}.csv` : NOT_AVAILABLE,
        export_format: "csv",
      });
    };

    return (
      <a
        ref={ref}
        {...anchorProps}
        href={downloadUrl}
        download
        onClick={handleClick}
      >
        {children}
      </a>
    );
  },
);

DownloadCsvLink.displayName = "DownloadCsvLink";

export default DownloadCsvLink;
