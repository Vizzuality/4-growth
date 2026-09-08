# Defer answer semantics to widget config rather than a client-side indicator list

The bar and pie charts tint the largest value with the accent pink. On `adoption-of-technology-by-country`
the largest answer under the automated data source is `Don't know`, so switching source moved the pink off
`Yes` and the widget read as "nobody knows". The first fix added `SEMANTIC_ANSWER_INDICATORS` to
`client/src/lib/constants.ts` — an indicator allowlist plus an answer-keyed palette, `Yes` pink, `Not at all`
navy, `Don't know` grey — and it has been reverted.

The colour is a claim about what an answer means, and the client has no way to derive that. `Yes` is not the
headline answer on every yes/no question: on "Are there specific barriers hindering further integration?" it
is the bad outcome. So the allowlist could never be inferred, only hand-written, one entry per question, in a
file that nothing forces anyone to update when a question is added. `0001-widget-sector-applicability.md`
reached the same wall with `AGRICULTURE_ONLY_INDICATORS` and closed by saying that if a third entry were ever
needed, the declaration should move onto the widget. This was that point, so the list goes rather than grows.

The intended home is a field on the widget in `api/data/sections/sections.json`, naming the positive answer
per question. That is seeded JSON, not the `base_widgets` column and migration that `0001` rejected as too
much machinery while the automated feed is still mock data.

## Considered options

- **Keep the allowlist and extend it per question.** Works today and costs nothing to ship. Rejected because it
  puts a statement about survey semantics in a client constants file, two directories away from the widget
  definitions that own every other property of a question, and nothing links the two.
- **Fix the palette instead of the mechanism.** Choosing different colours would have hidden the complaint
  without addressing which answer gets the accent, which is the actual question.
- **Stop tinting the largest value at all.** Removes the problem for every chart with no per-question data.
  Rejected because rank colouring is right on the questions that have no positive answer — a technology-type
  breakdown has no good or bad bar, and the largest one is the point.
- **A `sectors`-style column on `base_widgets`.** Already rejected in `0001` for the same reason, and nothing
  has changed about the automated feed since.

## Consequences

Until the widget field exists, `adoption-of-technology-by-country` shows the accent pink on `Don't know` under
the automated data source. This is known and accepted, not a bug to re-fix by re-adding the list. Anyone
tempted to should read this first; `git log -S SEMANTIC_ANSWER_INDICATORS` finds the revert.

One change from the reverted commit was kept: `getAreaGraphCategories` in
`client/src/containers/widget/area-graph/index.tsx` now accepts `Not at all` as the negative answer alongside
`No`. That function has an `else` catch-all, so without it both `Not at all` and `Don't know` wrote to the same
category, the later one overwrote the earlier, and the widget rendered two rows and two segments instead of
three — an answer disappeared. That is answer bucketing, not colouring, and had nothing to do with the
allowlist. `client/tests/widget/area-graph.test.tsx` now covers it; the existing `Maybe` case did not, because
`Maybe` falls through the same branch but never collides with a second label.

The two colour helper pairs the revert removed, `getSemanticAnswerCssColor` and `getSemanticAnswerTwColor`,
existed only because the pie chart needs a CSS colour for the slice and a Tailwind class for the legend swatch.
Whatever replaces them will need the same two forms.
