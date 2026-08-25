import { test, expect } from '@playwright/test';
import ROUTES from '@shared/constants/routes';

test.describe.configure({ mode: 'serial' });

test.describe('Projections sandbox', () => {
  test('loads without errors and never shows "Market Potential" widget heading', async ({ page }) => {
    await page.goto(`/${ROUTES.projections.sandbox}`);
    // The retired widget must not appear as a heading anywhere on the page.
    await expect(
      page.getByRole('heading', { name: 'Market Potential', level: 3 }),
    ).toHaveCount(0);
  });

  test('settings vertical options include "Addressable market" but not "Market Potential"', async ({ page }) => {
    await page.goto(`/${ROUTES.projections.sandbox}`);
    // Select a category to unlock Settings.
    await page
      .getByRole('region', { name: 'Operation area' })
      .getByText('Agriculture')
      .click();
    // Open Settings.
    await page.getByRole('button', { name: 'Settings' }).click();
    // Select a visualization first (required before Vertical appears).
    // Visualization options open in a dialog and are rendered as buttons.
    await page.getByRole('button', { name: 'Visualization' }).click();
    await page.getByRole('button', { name: 'Line chart' }).click();
    // Now "Vertical" button is visible — open it.
    // The expanded button text is "Vertical is <current-type>" so we match the button by name prefix.
    await page.getByRole('button', { name: /vertical/i }).click();
    // Vertical options open in a dialog as buttons (the selected one is already shown in the button text).
    // Assert that "Market Potential" is not one of the offered alternatives.
    await expect(page.getByRole('dialog').getByRole('button', { name: 'Market Potential' })).toHaveCount(0);
    // At least one valid D3.4 type must be present.
    await expect(page.getByRole('dialog').getByRole('button', { name: /Penetration|Revenues|Shipments/i }).first()).toBeVisible();
  });
});
