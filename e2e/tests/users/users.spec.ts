import { test, expect, Page } from '@playwright/test';
import { E2eTestManager } from '@shared/lib/e2e-test-manager';
import { User } from '@shared/dto/users/user.entity';

test.describe.configure({ mode: 'serial' });

test.describe('Users E2E', () => {
  let testManager: E2eTestManager;
  let page: Page;
  let user: User;



  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    testManager = await E2eTestManager.load(page);
  });

  test.beforeEach(async () => {
    user = await testManager.login();
  });

  test.afterEach(async () => {
    await testManager.clearDatabase();
  });

  test.afterAll(async () => {
    await testManager.logout();
    await testManager.close();
  });

  test.describe('Profile', () => {
    test.beforeEach(async () => {
      await testManager.getPage().goto('/profile');
    });
    test.describe('Update Profile', () => {
      test('a user can update the email', async () => {
        const newEmail = 'changed@test.com';
        await page
          .locator('form')
          .filter({ hasText: 'Email' })
          .getByRole('button')
          .click();
        await page.locator('input[name="email"]').fill(newEmail);
        await page.locator('input[name="email"]').press('Enter');
        await testManager.getPage().reload();
        await expect(await page.locator('input[type="email"]')).toHaveValue(
          newEmail
        );
      });
      test('user is notified when the current password is incorrect', async () => {
        await page.getByPlaceholder('Type your current password').click();
        await page
          .getByPlaceholder('Type your current password')
          .fill(user.password + '1');
        await page.getByPlaceholder('Create new password').click();
        await page.getByPlaceholder('Create new password').fill('1234567891');
        await page.getByRole('button', { name: 'Apply' }).click();
        await page.waitForSelector('[role="status"]');
        await expect(page.getByRole('status').first()).toHaveText(
          'Current password is incorrect'
        );
      });
      test('a user can update the password', async () => {
        await page.getByPlaceholder('Type your current password').click();
        await page
          .getByPlaceholder('Type your current password')
          .fill(user.password);
        await page.getByPlaceholder('Create new password').click();
        await page.getByPlaceholder('Create new password').fill('123456789');
        await page.getByRole('button', { name: 'Apply' }).click();
        await expect(page.getByRole('status').first()).toHaveText(
          'Your password has been updated successfully.'
        );
      });
    });
  });
  test.describe('Reset Password', () => {
    let passwordResetToken: string;
    let user: User;
    test('user can reset the password', async () => {
      await testManager.logout()
      user = await testManager.createUser({ email: 'reset-password@user.com'});
      passwordResetToken = await testManager.generateToken(user);
      await testManager.page.goto(`/auth/forgot-password/${passwordResetToken}`);
      const newPassword = 'newPassword123';
      await page.locator('input[name="password"]').click();
      await page.locator('input[name="password"]').fill(newPassword);
      await page.locator('input[name="repeatPassword"]').click();
      await page.locator('input[name="repeatPassword"]').fill(newPassword);
      await page.getByRole('button', { name: 'Submit' }).click();
      await page.getByPlaceholder('Enter your email').click();
      await page.getByPlaceholder('Enter your email').fill(user.email);
      await page.getByPlaceholder('*******').click();
      await page.getByPlaceholder('*******').fill(newPassword);
      await page.getByRole('button', { name: 'Log in' }).click();
      await page.waitForURL('/profile');
      await expect(page).toHaveURL('/profile');
    });
  });
});
