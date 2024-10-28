import { test, expect } from '@playwright/test';
import { E2eTestManager } from '@shared/lib/e2e-test-manager';
import { CreateUserDto } from '@shared/dto/users/create-user.dto';

test.describe('Authentication', () => {
  let testManager: E2eTestManager;
  let user: CreateUserDto = {
    email: `test-${Date.now()}@test.com`,
    password: 'password',
  };

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    testManager = await E2eTestManager.load(page);
  });

  test.afterAll(async () => {
    await testManager.logout();
    await testManager.deleteUserByEmail(user.email);
    await testManager.close();
  });

  test('a user signs up and signs in successfully', async ({ page }) => {
    await page.goto('/auth/signup');
    await page.getByLabel('Email').fill(user.email);
    await page.locator('input[type="password"]').fill(user.password);
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: /sign up/i }).click();

    await page.waitForURL('/auth/signin');

    await page.getByLabel('Email').fill(user.email);
    await page.locator('input[type="password"]').fill(user.password);

    await page.getByRole('button', { name: /log in/i }).click();

    await page.waitForURL('/profile');
    await expect(page.locator('input[type="email"]')).toHaveValue(user.email);
  });
});
