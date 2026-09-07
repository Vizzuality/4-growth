# Widget charts

## Right-hand y-axis layout (projections charts)

`vertical-bar-chart` and `line-chart` render their y-axis on the right with
`orientation="right"` and a custom `tick`. The axis occupies a reserved band —
`Y_AXIS_WIDTH` in `constants.ts` — and the label is drawn with
`textAnchor="start"`, so it grows _rightward into the band_, away from the plot.

That direction is the whole point. With `textAnchor="end"` the label grows
leftward instead, and the gap between the last bar and the number shrinks as the
number gets longer until a 4-character label such as `1.2B` sits on top of the
bar.

`Y_AXIS_WIDTH` is `2 + Y_AXIS_TICK_MARGIN + 56`:

| Term                 | Why                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `56`                 | Widest label. `formatProjectionValue` tops out at 8 characters — `-999.9bn`, since `en-GB` compact renders two-letter suffixes (`m`, `bn`, `tn`). Measured at 53.6px in Inter 12px/500, the tick's actual font; the remaining 2.4px is slack. `formatNumber` pins the locale, so this is a ceiling rather than an estimate — but only while the font and font-size are unchanged. Re-measure if either moves.                                                                                                                                                           |
| `Y_AXIS_TICK_MARGIN` | Clear gap between the last bar and the number.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `2`                  | Compensates `CHART_MARGIN.right = -BAR_GAP`. Recharts computes the plot width as `containerWidth − margin.left − margin.right − yAxisWidth`, so a negative right margin pushes the plot into the band. Without this term the widest label overruns the container's right edge, where `overflow-hidden` clips it. Only `vertical-bar-chart` passes `CHART_MARGIN`; `line-chart` uses Recharts' defaults and so gets 2px more clear space than it needs. The two charts share one width so their axes line up when a user switches visualization type on the same widget. |

Two things that look redundant but are not:

- `tickSize={0}` — `tickLine={false}` hides the line, but Recharts still adds the
  default `tickSize` of 6 to the `x` it hands a custom tick, which would widen
  the gap past `Y_AXIS_TICK_MARGIN`.
- `dominantBaseline="middle"` — a custom tick receives the raw `y` and gets none
  of Recharts' own baseline handling, so without this the number's baseline sits
  on its gridline instead of being centred on it.

If a unit (`%`, `€`) is ever appended to these tick labels, the 56px ceiling no
longer holds and the band has to be measured from the formatted ticks instead.

## The bottom label

`getYAxisTicks` puts its lowest tick at the domain's minimum, which maps to the
plot's bottom edge. That edge is also the widget card's clip edge, so the label
loses its bottom ~3px. `Y_AXIS_LABEL_LIFT` nudges the tick text up to clear it.

The lift is applied to the tick `<text>`'s `y`, not to the plot. Insetting the
plot with a bottom `margin` also works but lifts the bars off the card's bottom
edge, and they are meant to sit flush against it.

Nothing is misaligned by the lift: neither chart draws a `CartesianGrid` or any
`ReferenceLine`, so the label column has nothing to line up against.

There is only ~5.7px of vertical slack to spend — the bar chart's top clearance
is 8.6px and its bottom is -2.9px — so a lift much above 6 starts clipping the
top label instead. Measured clearances at 6: bottom 3.1px, top 2.6px.

Do not try to move the labels with a `transform` on `YAxis`. Recharts drops the
`style` prop on that component: the element renders with no inline style and a
computed `transform` of `none`. A `translate(30px, -10px)` sat there for a while
doing nothing at all.
