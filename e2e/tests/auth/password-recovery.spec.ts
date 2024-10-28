import { test, expect, Page } from '@playwright/test';
import { E2eTestManager } from '@shared/lib/e2e-test-manager';
import { User } from '@shared/dto/users/user.entity';
import { CreateUserDto } from '@shared/dto/users/create-user.dto';

test.describe.configure({ mode: 'serial' });

test.describe('Password Recovery E2E', () => {
  let testManager: E2eTestManager;
  let page: Page;
  let user: CreateUserDto = {
    email: `test-${Date.now()}@test.com`,
    password: 'password',
  };

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    testManager = await E2eTestManager.load(page);
  });

  test.beforeEach(async () => {
    user = await testManager.mocks().createUser();
  });

  test.afterAll(async () => {
    await testManager.logout();
    await testManager.deleteUserByEmail(user.email);
    await testManager.close();
  });

  test('an email should be sent when requesting a password recovery', async () => {
    await testManager.page.goto('/auth/signin');
    await page.getByRole('link', { name: 'Forgot password?' }).click();
    await page.getByPlaceholder('Enter your email').click();
    await page.getByPlaceholder('Enter your email').fill(user.email);
    await page.getByRole('button', { name: 'Send link' }).click();
    await expect(page.getByRole('status').first()).toHaveText(
      'Check your inbox for a password reset link.',
    );
  });
});
