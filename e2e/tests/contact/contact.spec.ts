import { test, expect, Page } from '@playwright/test';
import { E2eTestManager } from '@shared/lib/e2e-test-manager';

test.describe.configure({ mode: 'serial' });

test.describe('Contact E2E', () => {
  let testManager: E2eTestManager;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    testManager = await E2eTestManager.load(page);
  });
  test.afterAll(async () => {

    await testManager.close();
  });

  test('An email should be sent when sending a filled contact form', async () => {
    await page.goto('/contact-us');
    await page.getByPlaceholder('Enter your name').click();
    await page.getByPlaceholder('Enter your name').fill('John Doe');
    await page.getByPlaceholder('Enter your email').click();
    await page.getByPlaceholder('Enter your email').fill('test@mail.com');
    await page.getByPlaceholder('Enter your email').press('Tab');
    await page.getByPlaceholder('Enter your message here').fill('test message');
    await page.getByLabel('I agree with 4Growth\'s').click();
    await page.getByRole('button', { name: 'Send' }).click();
    await expect(page.getByRole('status').first()).toHaveText(
      'Message sent!'
    );
  });
});
