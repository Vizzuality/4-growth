# Save Projections Visualizations (SIRH-386)

## Overview

Add the ability for logged-in users to save projection sandbox configurations and manage them from the profile page. The backend (entity, service, controller, contract, migration) already exists. This is frontend-only work that replicates the existing survey analysis "save widget" pattern.

## 1. Save Button in Projections Sandbox

### Component: `CreateSavedProjectionMenu`

**Location:** `client/src/containers/widget/create-saved-projection/index.tsx`

Mirrors `CreateWidgetMenu` (`containers/widget/create-widget/index.tsx`).

**Behavior:**
- **Not logged in:** Renders a `SaveIcon` link to `/auth/signin?callbackUrl=<current URL>` (same as `CreateWidgetMenu`).
- **Logged in:** Renders a `SaveIcon` button inside a `Popover`. The popover content is the existing `SaveWidgetForm` component (reused, not duplicated).

**Props:**
```typescript
interface CreateSavedProjectionMenuProps {
  settings: CustomProjectionSettingsType | null;
  filters: FilterQueryParam[];
}
```

**On submit:**
1. Call `client.users.createSavedProjection.mutation()` with:
   - `params.userId` from session
   - `body.name` from form
   - `body.settings` from props
   - `body.dataFilters` from props
   - `extraHeaders` with auth token
2. On `201` response:
   - Invalidate saved projections query cache
   - Close popover
   - Show toast: "Your chart has been successfully saved in **your profile.**" (link to `/profile`)
   - Navigate to `getDynamicRouteHref("projections", "sandbox", String(body.data.id))`
3. On non-201: call `redirect()` from `useAuthRedirect`

### Wiring into the Sandbox

**File:** `client/src/containers/sandbox/projections-sandbox/index.tsx`

Pass `CreateSavedProjectionMenu` alongside the existing download `MenuButton` into `SandboxWidget`. The `SandboxWidget` component (`containers/widget/projections/sandbox/index.tsx`) needs a new optional `extraMenu` prop (or the `menuComponent` construction needs to combine both elements in a flex container).

**Approach:** Add a `save` prop to `SandboxWidget` alongside the existing `downloadUrl`. Inside `SandboxWidget`, construct the `menuComponent` as a flex container holding both the save button and the download menu, matching how the survey analysis widget combines `defaultMenu` + `extraHeaderActions`.

## 2. Unified Profile Table

### Unified Row Type

Both `CustomWidget` and `SavedProjection` are normalized into a single row type for the table:

```typescript
type VisualizationTool = "Survey Analysis" | "Projections";

interface SavedVisualizationRow {
  id: number;
  name: string;
  indicator: string;        // CustomWidget: widget.title; SavedProjection: extracted from settings vertical axis label
  tool: VisualizationTool;
  visualization: string;    // CustomWidget: defaultVisualization mapped to label; SavedProjection: chart type from settings key
  createdAt: Date;
  updatedAt: Date;
}
```

### Data Fetching

**File:** `client/src/containers/profile/saved-visualizations/table/index.tsx`

Fetch both sources in parallel:
- `client.users.searchCustomWidgets.useQuery()` (existing)
- `client.users.searchSavedProjections.useQuery()` (new)

Merge and normalize results into `SavedVisualizationRow[]`. Client-side sorting on the merged array.

Since the two APIs paginate independently, the simplest approach is to fetch all results from both (these are user-scoped, so the dataset is small) and handle pagination client-side on the merged array. If performance becomes a concern later, this can be revisited.

### Table Columns

| Column | Source (Survey Analysis) | Source (Projections) |
|--------|------------------------|---------------------|
| **Name** | `customWidget.name` | `savedProjection.name` |
| **Indicator** | `customWidget.widget.title` | Vertical axis indicator label extracted from `savedProjection.settings` |
| **Tool** | Static: `"Survey Analysis"` | Static: `"Projections"` |
| **Visualization** | `WIDGET_VISUALIZATIONS_MAP[defaultVisualization]` | Chart type key from settings (e.g., `"Line chart"`, `"Bar chart"`, `"Bubble chart"`, `"Table"`) |

The last column (Visualization) also contains the actions button (ellipsis menu with delete), same as the current "Type of chart" column.

### Visualization Type Labels (Projections)

Map projection settings keys to display labels:
- `line_chart` -> `"Line chart"`
- `bar_chart` -> `"Bar chart"`
- `bubble_chart` -> `"Bubble chart"`
- `table` -> `"Table"`

### Delete Action

The `ActionsMenu` / `DeleteVisualizationButton` becomes polymorphic:
- Receives `tool` discriminator and `id`
- Calls `client.users.deleteCustomWidget.mutation()` for Survey Analysis rows
- Calls `client.users.deleteSavedProjection.mutation()` for Projections rows
- Invalidates the appropriate query cache based on `tool`

### Row Click Navigation

- Survey Analysis rows: `getDynamicRouteHref("surveyAnalysis", "sandbox", id)` (existing behavior)
- Projections rows: `getDynamicRouteHref("projections", "sandbox", id)` (new)

## 3. Query Keys

**File:** `client/src/lib/queryKeys.ts`

Add to `usersKeys`:
```typescript
savedProjections: (userId: string, options: Record<string, unknown>) => [
  "saved-projections",
  userId,
  options,
],
savedProjection: (savedProjectionId: string) => [
  "saved-projection",
  savedProjectionId,
],
```

## 4. Loading a Saved Projection

**New file:** `client/src/app/(root)/projections/sandbox/[id]/page.tsx`

No `[id]` route exists yet for projections sandbox. Create one following the survey analysis pattern (`client/src/app/(root)/survey-analysis/sandbox/[id]/page.tsx`):

1. Server component that receives `params.id`
2. Fetches session via `auth()`
3. Calls `client.users.findSavedProjection.query()` with `{ userId, id }` + auth header
4. On non-200: redirect to sign-in (401) or plain sandbox (other errors)
5. On success: prefetch the result into a `QueryClient`, wrap children in `<Hydrate>`
6. Render the projections `Sandbox` component with the saved projection's `settings` and `dataFilters` applied as initial URL state

The `Sandbox` component (`containers/sandbox/projections-sandbox/index.tsx`) needs to accept an optional `savedProjectionId` prop. When present, it fetches the saved projection from the query cache and initializes `useSettings` and `useFilters` with the saved values.

## Files to Create

| File | Purpose |
|------|---------|
| `client/src/containers/widget/create-saved-projection/index.tsx` | Save button + popover for projections sandbox |

## Files to Modify

| File | Change |
|------|--------|
| `client/src/containers/sandbox/projections-sandbox/index.tsx` | Pass save button to `SandboxWidget` |
| `client/src/containers/widget/projections/sandbox/index.tsx` | Accept and render save button in widget header |
| `client/src/containers/profile/saved-visualizations/table/index.tsx` | Fetch both data sources, merge, unified row type |
| `client/src/containers/profile/saved-visualizations/table/columns/index.tsx` | New columns: Name, Indicator, Tool, Visualization + actions |
| `client/src/containers/profile/saved-visualizations/table/columns/actions-button/actions-menu/delete-visualization-button/index.tsx` | Polymorphic delete (widget vs projection) |
| `client/src/lib/queryKeys.ts` | Add `savedProjections` and `savedProjection` keys |

## Files to Create (continued)

| File | Purpose |
|------|---------|
| `client/src/app/(root)/projections/sandbox/[id]/page.tsx` | Dynamic route for loading a saved projection |

## Out of Scope

- Backend changes (already complete)
- Update/rename saved projections (not in acceptance criteria)
- Sharing saved projections between users
