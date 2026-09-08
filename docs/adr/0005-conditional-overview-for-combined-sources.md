# Conditional overview layout for combined data sources

Combining **Automated data** with **Survey data** strands two of the overview's four widgets: the country map
has no geometry to draw for forestry-only web-scraped rows, and the sector chart is pinned to Forestry by the
Forestry lock. Rather than remove them from the section outright, the overview branches: the single-source
view keeps all four widgets, and only the combined view collapses to the two counters. The map is the landing
page's most legible asset and survey-only is the default state, so deleting it to satisfy a state most
sessions never enter was the worse trade — at the cost of a layout that changes shape when the sidebar filter
changes, and of two layouts to keep alive in `OverviewSection`.

## Consequences

- The section reads the per-source split off the widget payload, not off the `data-source` filter, so the
  layout and the widgets inside it change over on the same render.
- The API still returns all four overview widgets in both states. Keeping the response shape constant is
  deliberate: one payload serves both layouts, and `sections.json` stays a description of the section rather
  than of a viewport.
- The counters' bars compare **raw counts** across sources by length, inverting the rule that source
  comparison normalizes each source to its own total. That rule exists so answer distributions of unequal
  volume stay comparable; these two widgets exist to report volume, which is the question the glossary says
  source comparison does not answer.
- Each bar is drawn as `value / total`, the shared denominator `addCounterSplit` already hands every panel,
  so full card width means "all the data there is" in the combined view exactly as it does on the
  single-source card, and the unfilled remainder is what the active filters excluded. The alternative —
  scaling to the largest figure in the widget — draws the same ratio between the two bars but discards that.
  One caveat this inherits: distinct country counts are not additive across sources, so two nearly-full bars
  can sum past 100%. Each is true on its own; the layout must not invite adding them.
