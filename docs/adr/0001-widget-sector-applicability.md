# Withhold agriculture widgets on the client when the data source includes automated

Automated web analysis covers forestry organisations, so selecting it pins the sector filter to Forestry and leaves the agriculture questions with nothing meaningful to report. Rather than model sector applicability in the API, the client withholds a two-entry list of agriculture-only indicators whenever the data source includes `automated`, and additionally drops any widget whose data is empty under that source. Survey-only views are untouched — there, an empty widget means nobody in the current selection answered, which is a result rather than noise.

`isEmptyWidget` was also corrected: a chart whose only answers are `N/A` now counts as empty. Every display and metric path already strips those answers, so such a widget was rendering a 0% response rate above a blank chart.

## Considered options

- **Widget-declared sector applicability, filtered in the API.** A `sectors` column on `base_widgets`, a migration, a contract field, and omission inside `searchSectionsWithData` — so the section nav, indicator selector and export all inherit the rule. Rejected as too much machinery for two widgets while the automated feed is still mock data and its real coverage is unknown.
- **Hide any widget with no data, on every data source.** Needs no list at all, but makes the page reflow whenever an ordinary country filter yields nothing, and removes a signal that is meaningful on survey data.
- **A minimum response threshold.** Would have handled the stray answer below without a curated list, and generalises to every thin-data widget. Rejected because the number is a statistical disclosure decision for whoever owns the reporting, not an implementation detail.

## Consequences

The emptiness rule alone could not meet the requirement. In the seeded data one Forestry-sector respondent answered the agriculture technology question, so `technology-type-agriculture` had a single non-`N/A` response and would have rendered one bar at 100% under `survey + automated`. The curated list exists to override that: agriculture applicability is a claim about the question, not about how many people happened to answer it.

`AGRICULTURE_ONLY_INDICATORS` lives in `client/src/lib/constants.ts`, away from the widget definitions in `api/data/sections/sections.json`. Adding a new agriculture-specific question will not update it. If a third entry is ever needed, prefer moving the declaration onto the widget instead of extending the list.

The rule applies only to the explore page's content sections. The overview section renders through a separate path and is unaffected; `/widgets/:indicator` still serves any indicator, so a saved custom widget or sandbox URL on an agriculture indicator still resolves — it now shows the "no data" card rather than a blank chart.

Separately noted and **not fixed here**: `withForestryLock` sets `sector = Forestry` as an exact match, which under `survey + automated` also excludes the 82 `Both` and 107 `N/A` respondents from the survey series, understating it on every forestry widget.
