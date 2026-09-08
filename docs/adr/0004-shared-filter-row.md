# One filter row, two pickers — not two rows

The desktop sidebar and the mobile filters sheet each rendered their own filter row. The two files
were the same markup written twice: the label, the selected-value chips, the locked-sector state, the
data-source help button. They differed only in what wrapped the trigger — a Popover on desktop, a
Sheet on mobile — and in where the filters came from (`useFilters()` over the nuqs `q` param against
`useFilterSettings()` over a Jotai draft atom).

The copies drifted. The desktop row grew a branch that renders `Survey` and `Automated` as separate
hatched labels whenever both sources are selected; the mobile row never got it, so mobile printed the
flat string `Survey and Automated` and a mobile user had no way to learn what the hatched bars meant.
That is SIRH-503: partners reported the charts as unlabelled.

The row body is now one component, `client/src/containers/filter/filter-row/index.tsx`, exporting
`FilterRowButton` (the trigger, `forwardRef`'d so `PopoverTrigger asChild` can drive it) and
`FilterRowFrame` (the positioned wrapper the help button and the locked-sector reason hang off — the
help button cannot live inside the trigger, because a button cannot contain another button). Each
side keeps its own picker and its own filter source and passes them in.

## Considered options

- **Patch the mobile row.** Add the missing comparison branch, about six lines in one file. Fixes
  today's bug and leaves the mechanism that produced it: the next change to the desktop row drifts
  the same way, silently, and only on mobile.
- **Unify `FilterSettings` entirely** — one component for both, with the picker and the filter source
  injected, deleting `containers/bottom-bar/*/filter-settings`. This is what the design comment on
  SIRH-503 asks for in spirit ("all updates to the sidebar modules on desktop would be reflected in
  their respective modules on mobile"). Rejected for now: the two `FilterSettings` also diverge on
  the projections-only branches (`scenario` and `category` exclusions, the table-visualisation
  scenario filter) and on the mobile-only breakdown selector, so unifying them means resolving four
  unrelated differences inside a ticket about a legend.
- **Share the row through a hook rather than a component.** Would leave the JSX duplicated, which is
  where the drift happened.

## Consequences

`reasonId` is threaded from each wrapper into both `FilterRowFrame` and `FilterRowButton`. It looks
redundant. It is not: the locked-sector explanation is a sibling of the trigger, so the `id` and the
`aria-describedby` that points at it are owned by two different components. Putting the explanation
inside the trigger instead would fold its text into the button's accessible name.

The two `FilterSettings` components are still copies. This ADR does not fix that, and the drift risk
there is real — the ordering logic and the custom-filter handling exist twice. That is the follow-up.
