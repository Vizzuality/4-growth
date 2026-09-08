# Glossary

## Responses

The number of answers a figure was computed from. On the country map it is the per-country
denominator, and the tooltip states it as a fraction — `55 of 173 responses` beside `32%`.

It counts answers to one question, not surveys and not respondents. Answers of `Yes`, `No`,
`Not at all` and `Don't know` are counted; `N/A` is not, because it is a non-response rather than an
opinion. So a country's response count is lower than the number of surveys it returned, and two
questions can report different counts for the same country.

"Responses" is the word users see and the word partners use. In data and code the map payload calls
the numerator `count` and the denominator `total`. The widget header's `Response rate` pill counts
the same way — the chart total minus its `N/A` row — so the pill and the map are the same unit.

## Data source

Where a figure came from. Two values: **Survey** (answers people gave) and **Automated** (data
scraped from organisation websites). A user picks one or both, and picking both is a third distinct
mode rather than a multi-select — the picker is a radio group, so the only combinations are
`survey`, `automated`, and `survey + automated`.

"Data is" is the label users see. In data and code it is the `data-source` page filter, and its
values are the bare strings `survey` and `automated`. It exists only on the survey-analysis pages;
the projections pages have no data source.

With both sources selected, the app is in **comparison mode**: widgets split into one figure per
source, the leading source drawn solid and the rest hatched. The order is fixed — survey first —
so the chart and the legend cannot disagree.

## Source legend

The `Data is Survey and Automated` row that explains the hatching. Survey appears as a solid pill,
Automated as a hatched pill, matching the fills the bars use.

It is not one place in the UI. On desktop it is the data-source row of the sidebar filters. On
mobile, where there is no sidebar, the same row appears twice: inside the filters sheet, and as a
read-only strip above the bottom bar's buttons. The strip appears only in comparison mode, and
shows no filter other than the data source.

## Operation area

The sector a projection applies to. Two values: **Forestry** and **Agriculture**. A user picks
exactly one; nothing renders on the projections page until they do.

"Operation area" is the name users see. In data and code the same thing is called `category` —
there is no `operationArea` field anywhere. Searching for the user-facing name will not find it.

## Scenario

A future the projections are modelled under. Four values: **Baseline**, **Reimagining Progress**,
**Fractured Continent**, **Corporate Epoch**. A user picks exactly one, and cannot pick none —
`baseline` is the resting value.

Two different texts describe a scenario, and they are not interchangeable:

- **Scenario description** — what the projected outputs represent for one operation area under one
  scenario. Owned by LE. Differs per (operation area, scenario) pair, so there are eight.
- **Scenario narrative** — what the world looks like in 2040 under that scenario. Independent of
  operation area, so there are four. Reached through the `?` button beside the sidebar Scenarios
  selector.
