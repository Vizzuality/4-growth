import { test, expect } from '@playwright/test';
import ROUTES from '@shared/constants/routes';

test.describe.configure({ mode: 'serial' });

const WIDGET_TITLES = [
  'Addressable Market',
  'Penetration',
  'Shipments',
  'Installed Base',
  'Prices',
  'Revenues',
];

test.describe('Projections page', () => {
  for (const category of ['Agriculture', 'Forestry'] as const) {
    test(`renders 6 widgets for ${category} and never shows "Market Potential" widget`, async ({ page }) => {
      await page.goto(`/${ROUTES.projections.explore}`);
      // The category checkboxes are sr-only — click the parent label via its text.
      await page
        .getByRole('region', { name: 'Operation area' })
        .getByText(category)
        .click();
      // Each widget renders an h3 heading via WidgetHeader — wait for all 6 to appear.
      for (const title of WIDGET_TITLES) {
        await expect(page.getByRole('heading', { name: title, level: 3 })).toBeVisible();
      }
      // The retired "Market Potential" widget must not appear as an h3 heading.
      await expect(
        page.getByRole('heading', { name: 'Market Potential', level: 3 }),
      ).toHaveCount(0);
    });
  }
});
