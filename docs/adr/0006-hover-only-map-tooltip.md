# The map sample-size tooltip is hover-only

The "Adoption of technology by country" choropleth showed a percentage and nothing else. Partners
reading it could not tell a country's colour apart on sample size: Finland's figure rests on 173
responses, while Italy, Spain and Austria came back as darker on one or two. The counts already
existed in the API — `addMapDataToWidget` computed `yes_cnt` and `total_cnt` in a CTE and dropped
both in the final `SELECT` — so the fix was to project them and show them.

They are shown in a tooltip that opens on `onMouseEnter` over a country. That tooltip is the only
place the counts appear in the UI. It cannot be reached with a keyboard, and a screen reader is
never told it exists.

`.claude/rules/frontend/accessibility.md` sets WCAG 2.1 AA for this project and says data
visualisations must have text alternatives and that every interactive element must be
keyboard-operable. This satisfies neither. It was chosen anyway, to keep the change small, and it is
a deviation rather than an oversight.

## Considered options

- **Focusable countries.** `tabIndex={0}` and an `aria-label` on each country that has data, with
  keyboard focus opening the same tooltip, and the existing `focus:outline-none` replaced by a real
  focus ring. Conformant. Rejected on cost and on the result: the GeoJSON has 135 features and
  roughly 29 to 52 carry data, so it puts around 29 tab stops inside one widget, and a keyboard user
  comparing two countries has to traverse the map between them. WCAG 1.4.13 would additionally
  require the tooltip to be dismissable with Escape and to stay open while hovered.
- **A text alternative beside the map** — the same country, percentage and fraction as rows, either
  visually hidden or as a real toggle reusing `client/src/containers/widget/table/index.tsx`. One tab
  stop, the whole dataset, and it names the mechanism the rule itself allows. This is the better
  answer and it is the follow-up. Rejected here only for scope.

## Consequences

The CSV export gains `count` and `total` alongside `country` and `value`, so the full dataset is
reachable without a pointer. That is a partial mitigation and not conformance — it requires leaving
the page, and it says nothing to a screen reader about the map itself.

The map was, before this change, the only widget whose export carried no denominator. It now matches
the chart, counter and breakdown branches.

Nothing about the colour encoding changed. A country's fill still says only "this percentage band",
and a reader who does not hover still cannot tell 100%-of-one-response from 100%-of-two-hundred. The
ticket's own suggestions for fixing that in the visual — fading, or hatching — are both unavailable:
hatching already means "Automated data source" in comparison mode, and fading moves a country toward
`navy-950` and `navy-900`, the two fills that already mean "no data".
