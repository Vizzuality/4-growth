import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider, createStore } from "jotai";
import { describe, expect, it, vi } from "vitest";

import { analyticsConsentAtom } from "@/app/store";

vi.mock("@next/third-parties/google", () => ({
  sendGAEvent: vi.fn(),
}));

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

import { sendGAEvent } from "@next/third-parties/google";
import { useSession } from "next-auth/react";

import SandboxMenu from "@/containers/widget/sandbox-menu";

const mockedUseSession = vi.mocked(useSession);
const mockedSendGAEvent = vi.mocked(sendGAEvent);

const defaultProps = {
  downloadUrl: "/api/export?format=csv",
  onSave: vi.fn(),
};

describe("SandboxMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseSession.mockReturnValue({
      data: {
        user: {
          id: "1",
          email: "user@example.com",
          createdAt: new Date(0),
          customWidgets: [],
        },
        accessToken: "token",
        expires: "",
      },
      status: "authenticated",
      update: vi.fn(),
    });
  });

  it("renders the ellipsis trigger button", () => {
    render(<SandboxMenu {...defaultProps} />);
    expect(screen.getByTestId("sandbox-menu-button")).toBeInTheDocument();
  });

  it("shows Save visualization and Download as CSV when signed in", async () => {
    render(<SandboxMenu {...defaultProps} />);

    fireEvent.click(screen.getByTestId("sandbox-menu-button"));

    await waitFor(() => {
      expect(screen.getByText("Save visualization")).toBeInTheDocument();
      expect(screen.getByText("Download as CSV")).toBeInTheDocument();
    });
  });

  it("does not show Update saved visualization when onUpdate is not provided", async () => {
    render(<SandboxMenu {...defaultProps} />);

    fireEvent.click(screen.getByTestId("sandbox-menu-button"));

    await waitFor(() => {
      expect(
        screen.queryByText("Update saved visualization"),
      ).not.toBeInTheDocument();
    });
  });

  it("shows Update saved visualization when onUpdate is provided", async () => {
    render(<SandboxMenu {...defaultProps} onUpdate={vi.fn()} />);

    fireEvent.click(screen.getByTestId("sandbox-menu-button"));

    await waitFor(() => {
      expect(
        screen.getByText("Update saved visualization"),
      ).toBeInTheDocument();
    });
  });

  it("renders Save visualization as a sign-in link when not authenticated", async () => {
    mockedUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
      update: vi.fn(),
    });
    render(<SandboxMenu {...defaultProps} />);

    fireEvent.click(screen.getByTestId("sandbox-menu-button"));

    await waitFor(() => {
      const saveLink = screen.getByText("Save visualization");
      expect(saveLink.closest("a")).toHaveAttribute(
        "href",
        expect.stringContaining("/auth/signin"),
      );
    });
  });

  it("opens the save dialog when Save visualization is clicked", async () => {
    render(<SandboxMenu {...defaultProps} />);

    fireEvent.click(screen.getByTestId("sandbox-menu-button"));

    await waitFor(() => {
      expect(screen.getByText("Save visualization")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Save visualization"));

    await waitFor(() => {
      expect(screen.getByText("Save chart")).toBeInTheDocument();
      expect(screen.getByLabelText("Chart name")).toBeInTheDocument();
    });
  });

  it("calls onUpdate when Update saved visualization is clicked", async () => {
    const onUpdate = vi.fn();
    render(<SandboxMenu {...defaultProps} onUpdate={onUpdate} />);

    fireEvent.click(screen.getByTestId("sandbox-menu-button"));

    await waitFor(() => {
      expect(
        screen.getByText("Update saved visualization"),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Update saved visualization"));

    expect(onUpdate).toHaveBeenCalledOnce();
  });

  it("renders Download as CSV as a download link with correct URL", async () => {
    render(<SandboxMenu {...defaultProps} />);

    fireEvent.click(screen.getByTestId("sandbox-menu-button"));

    await waitFor(() => {
      const downloadLink = screen.getByText("Download as CSV");
      expect(downloadLink.closest("a")).toHaveAttribute(
        "href",
        "/api/export?format=csv",
      );
    });
  });

  it("fires the GA event with chart metadata when Download as CSV is clicked with consent", async () => {
    const store = createStore();
    store.set(analyticsConsentAtom, true);

    render(
      <Provider store={store}>
        <SandboxMenu
          {...defaultProps}
          chartId="indicator-1"
          chartTitle="My Chart Title"
          section="survey-analysis-sandbox"
          visualisationType="horizontal_bar_chart"
        />
      </Provider>,
    );

    fireEvent.click(screen.getByTestId("sandbox-menu-button"));

    await waitFor(() => {
      expect(screen.getByText("Download as CSV")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Download as CSV"));

    expect(mockedSendGAEvent).toHaveBeenCalledWith(
      "event",
      "visualisation_csv_download",
      {
        chart_id: "indicator-1",
        chart_title: "My Chart Title",
        section: "survey-analysis-sandbox",
        visualisation_type: "horizontal_bar_chart",
        file_name: "my-chart-title.csv",
        file_extension: "csv",
        export_format: "csv",
        page_location: window.location.href,
      },
    );
  });
});
