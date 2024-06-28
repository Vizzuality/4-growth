import { defineConfig, devices } from '@playwright/test';
import {E2eTestManager} from "@shared/lib/e2e-test-manager";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    /* Run your local dev server before starting the tests */
    webServer: [
        {
            command: 'pnpm --filter api run build && pnpm --filter api run start:prod',
            url: E2eTestManager.getAPIUrl(),
            reuseExistingServer: !process.env.CI,
        },
        {
            command: 'pnpm --filter client run build && pnpm --filter client run start',
            url: E2eTestManager.getClientUrl(),
            reuseExistingServer: !process.env.CI,
            env: {
                NEXTAUTH_SECRET: '7YWG6xGr8PzPWGpZteadxdqGjm/uyu/Qi48ArBpG4ag=',
                NEXTAUTH_URL: `${E2eTestManager.getClientUrl()}/auth/api`,
                NEXT_PUBLIC_API_URL: E2eTestManager.getAPIUrl(),
            },
        },
    ],
    testDir: './tests',
    /* Run tests in files in parallel */
    fullyParallel: false,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: process.env.CI ? 'list' : 'html',
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: E2eTestManager.getClientUrl(),
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
    },
    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        ...process.env.CI ? [] : [
            {
                name: 'firefox',
                use: { ...devices['Desktop Firefox'] },
            },

            {
                name: 'webkit',
                use: { ...devices['Desktop Safari'] },
            },
        ]
    ],
});
