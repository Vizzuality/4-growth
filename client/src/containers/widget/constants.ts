// BAR_GAP is explicitly set to compensate for the default spacing at chart edges
// This ensures consistent bar spacing across the entire chart width
export const BAR_GAP = 2 as const;
export const CHART_MARGIN = {
  top: 0,
  left: -BAR_GAP,
  right: -BAR_GAP,
  bottom: 0,
} as const;
/**
 * The XAxis component adds default height to the chart container
 * We use negative margin to compensate and keep the chart compact
 * See: https://recharts.org/en-US/api/XAxis#height
 */
export const CHART_CONTAINER_CLASS_NAME =
  "-mb-[30px] [&_.recharts-cartesian-axis-tick_text]:fill-foreground [&_.recharts-cartesian-axis-tick_text]:font-medium" as const;
