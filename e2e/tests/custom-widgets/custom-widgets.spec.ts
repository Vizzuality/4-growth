import { test, expect, Page } from '@playwright/test';
import { E2eTestManager } from '@shared/lib/e2e-test-manager';
import { User } from '@shared/dto/users/user.entity';
import { CustomWidget } from '@shared/dto/widgets/custom-widget.entity';
import { In } from 'typeorm';

test.describe.configure({ mode: 'serial' });

test.describe('Custom Charts E2E', () => {
  let testManager: E2eTestManager;
  let page: Page;
  let user: User;
  let customWidgets: CustomWidget[] = [];

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    testManager = await E2eTestManager.load(page);
  });

  test.beforeEach(async () => {
    user = await testManager.login();
  });

  test.afterEach(async () => {
    await testManager.deleteUserByEmail(user.email);

    if (customWidgets.length > 0) {
      await testManager.dataSource.getRepository(CustomWidget).delete({
        id: In(customWidgets.map((widget) => widget.id)),
      });

      customWidgets = [];
    }
  });

  test.afterAll(async () => {
    await testManager.logout();
    await testManager.close();
  });

  test.describe('List Custom Charts', () => {
    test.beforeEach(async () => {
      for (const n of Array(10).keys()) {
        const widget = await testManager.mocks().createCustomWidget({
          name: `Test chart ${n}`,
          user: { id: user.id },
        });
        customWidgets.push(widget);
      }
    });
    test('a user can see a list of custom charts', async () => {
      // TODO: Implement test for listing created charts
    });
  });

  test.describe('Rename Custom Chart', () => {
    test('a user can rename a custom chart', async () => {
      const widget = await testManager
        .mocks()
        .createCustomWidget({ user: { id: user.id } });
      customWidgets.push(widget);

      await page.goto('/profile');
      await page
        .getByRole('cell', { name: 'Area chart' })
        .getByRole('button')
        .click();
      await page.getByRole('button', { name: 'Rename' }).click();
      await page.locator('input[type="text"]').fill('Change');
      await page.locator('input[type="text"]').press('Enter');
      await expect(page.getByRole('status').first()).toHaveText(
        'Visualization updated successfully.',
      );
    });
  });

  test.describe('Delete Custom Chart', () => {
    test('a user can delete a custom chart', async () => {
      const widget = await testManager
        .mocks()
        .createCustomWidget({ user: { id: user.id } });
      customWidgets.push(widget);

      await page.goto('/profile');
      await page
        .getByRole('cell', { name: 'Area chart' })
        .getByRole('button')
        .click();
      await page.getByRole('button', { name: 'Delete', exact: true }).click();
      await page.getByRole('button', { name: 'Delete visualization' }).click();
      await expect(page.getByRole('status').first()).toHaveText(
        'Visualization removed successfully.',
      );
    });
  });
});
