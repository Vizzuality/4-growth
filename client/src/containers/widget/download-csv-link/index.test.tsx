import { fireEvent, render, screen } from "@testing-library/react";
import { Provider, createStore } from "jotai";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { analyticsConsentAtom } from "@/app/store";

import DownloadCsvLink from "@/containers/widget/download-csv-link";

const sendGAEvent = vi.fn();
vi.mock("@next/third-parties/google", () => ({
  sendGAEvent: (...args: unknown[]) => sendGAEvent(...args),
}));

function renderWithConsent(
  consent: boolean | undefined,
  props: Partial<{
    chartId: string;
    chartTitle: string;
    section: string;
  }> = {},
) {
  const store = createStore();
  store.set(analyticsConsentAtom, consent);
  return render(
    <Provider store={store}>
      <DownloadCsvLink downloadUrl="http://api.test/widgets/q1/export" {...props}>
        Download as CSV
      </DownloadCsvLink>
    </Provider>,
  );
}

describe("DownloadCsvLink", () => {
  beforeEach(() => {
    sendGAEvent.mockClear();
  });

  it("fires the GA4 event with all params when consent is granted", () => {
    renderWithConsent(true, {
      chartId: "q1",
      chartTitle: "Adoption & Impact",
      section: "Overview",
    });

    fireEvent.click(screen.getByText("Download as CSV"));

    expect(sendGAEvent).toHaveBeenCalledTimes(1);
    expect(sendGAEvent).toHaveBeenCalledWith(
      "event",
      "visualisation_csv_download",
      {
        chart_id: "q1",
        chart_title: "Adoption & Impact",
        section: "Overview",
        file_name: "adoption-impact.csv",
        export_format: "csv",
      },
    );
  });

  it("substitutes 'not_available' for missing params", () => {
    renderWithConsent(true, { chartId: "q1" });

    fireEvent.click(screen.getByText("Download as CSV"));

    expect(sendGAEvent).toHaveBeenCalledWith(
      "event",
      "visualisation_csv_download",
      {
        chart_id: "q1",
        chart_title: "not_available",
        section: "not_available",
        file_name: "not_available",
        export_format: "csv",
      },
    );
  });

  it("does not fire the event when consent is not granted", () => {
    renderWithConsent(undefined, { chartId: "q1", chartTitle: "Adoption" });

    fireEvent.click(screen.getByText("Download as CSV"));

    expect(sendGAEvent).not.toHaveBeenCalled();
  });

  it("does not fire the event when consent is explicitly false", () => {
    renderWithConsent(false, { chartId: "q1", chartTitle: "Adoption" });

    fireEvent.click(screen.getByText("Download as CSV"));

    expect(sendGAEvent).not.toHaveBeenCalled();
  });

  it("renders a download anchor pointing at the export URL", () => {
    renderWithConsent(true, { chartId: "q1" });

    const link = screen.getByText("Download as CSV");
    expect(link).toHaveAttribute("href", "http://api.test/widgets/q1/export");
    expect(link).toHaveAttribute("download");
  });
});
