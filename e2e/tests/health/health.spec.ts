import { test, expect } from '@playwright/test';
import { E2eTestManager } from '@shared/lib/e2e-test-manager';
import { Application } from 'e2e/application';

test.describe('Health', () => {
  let testManager: E2eTestManager;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    testManager = await E2eTestManager.load(page);
  });

  test.afterAll(async () => {
    await testManager.close();
  });

  test.describe('when the backend is up', () => {
    test('an anonymous user tries to check the application\'s health (both frontend and backend)', async ({ page }) => {
        // Given that backend application was succesfully started
        // App already started in globalSetup. Just being explicit here.
        await Application.startAPIServer();
    
        // When
        const response = await page.goto('/health');
    
        // Then
        expect(response?.status()).toBe(200);
        await expect(page.getByText('OK')).toBeVisible();
      });
  })

  test.describe('when the backend is down', () => {
    test.afterAll(async () => {
        await Application.startAPIServer();
    })

    test('an anonymous user tries to check the application\'s health (both frontend and backend)', async ({ page }) => {
        // Given that the backend app is unavailable
        await Application.stopAPIServer();
    
        // When
        const response = await page.goto('/health');
    
        // Then
        expect(response?.status()).toBe(503);
        await expect(page.getByText('KO')).toBeVisible();
      });
  })
});
