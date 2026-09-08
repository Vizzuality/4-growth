# Eight scenario descriptions checked in verbatim, not four templates

LE supplied eight scenario descriptions for the projections page — one per (operation area,
scenario) pair. Read side by side, the Forestry and Agriculture texts for a given scenario are
word-for-word identical except for one phrase: "the Forestry digital technologies market" against
"the Agriculture digital technologies market". Nothing else differs, in any of the four scenarios.

So four strings with an interpolated sector word would render the same eight paragraphs from half
the text, with no way for the two sectors to drift apart by accident.

They are stored as eight literal strings anyway, in
`client/src/containers/scenarios/descriptions/constants.ts`.

The reason is ownership. LE writes this copy, not us, and SIRH-414 specifies it as "8 different
combinations". A template encodes a rule LE never agreed to — that only the sector word will ever
differ between Forestry and Agriculture. The moment they revise one sector's text on its own, that
rule is wrong and the template has to be unpicked back into eight strings under time pressure. Eight
strings also mean a copy revision is a paste: LE sends all eight, and eight replace eight, with no
one having to work out which words are shared and which are per-sector.

## Considered options

- **Four templates with an `{operationArea}` placeholder.** Half the text and no drift. Rejected for
  the reason above — it turns an observation about today's copy into a constraint on tomorrow's.
- **Four templates plus an optional per-combination override map.** Handles a future divergence
  without a refactor, but carries two mechanisms for copy nobody has asked to diverge yet, and a
  reader then has to check both to know what a card actually says.
- **Move the copy to the database, alongside `projection_types.description`.** The one existing path
  for API-served projections copy. Rejected as disproportionate: there is no `scenarios` table —
  scenario is a bare enum column on `projections` — so this needs a new table, a migration and a
  contract route to serve eight static strings that only LE changes. SIRH-415 is a frontend ticket.

## Consequences

Eight near-identical paragraphs live in one file, and the shared sentence is written four times.
Editing the shared wording by hand means eight edits, not four, and getting one wrong is silent.

`constants.test.ts` covers exactly that failure: it asserts all eight combinations exist and that
each names its own operation area and not the other one. A paste that leaves an Agriculture entry
talking about Forestry fails the suite. That test is the reason this structure is acceptable — do not
delete it while the eight strings stand.

The record is typed `Record<ProjectionCategory, Record<ProjectionScenarios, string>>`, so a missing
combination is a type error rather than an empty card. This is why `ProjectionScenarios` in
`shared/dto/projections/projection-types.ts` gained `as const` — without it the members type as
`string` and the record accepts any keys at all.
