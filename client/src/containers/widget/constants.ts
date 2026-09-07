// BAR_GAP is explicitly set to compensate for the default spacing at chart edges
// This ensures consistent bar spacing across the entire chart width
export const BAR_GAP = 2 as const;
export const CHART_MARGIN = {
  top: 20,
  left: -BAR_GAP,
  right: -BAR_GAP,
  bottom: 0,
} as const;
/**
 * The XAxis component adds default height of 30px to the chart container
 * We use translateY to compensate and keep the chart compact
 * See: https://recharts.org/en-US/api/XAxis#height
 */
export const CHART_STYLES = {
  transform: "translateY(30px)",
};
/**
 * Upward nudge for the y-axis tick labels. The lowest tick sits on the plot's
 * bottom edge, which is also the widget card's clip edge, so without this its
 * bottom few pixels are cut off. Applied to the tick text, not the axis — see
 * ./README.md.
 */
export const Y_AXIS_LABEL_LIFT = 6;
export const Y_AXIS_TICK_MARGIN = 10;
/**
 * Reserved width of the right-hand y-axis band: 2px margin compensation
 * + Y_AXIS_TICK_MARGIN + 56px for the widest label formatProjectionValue
 * can produce. See ./README.md before changing either number.
 */
export const Y_AXIS_WIDTH = 68;
export const CHART_CONTAINER_CLASS_NAME =
  "[&_.recharts-cartesian-axis-tick_text]:fill-foreground [&_.recharts-cartesian-axis-tick_text]:font-medium" as const;
export const BUBBLE_CHART_TICK_INTERVAL = 1000;
