import { defineConfig, devices } from '@playwright/test';

const API_URL = 'http://localhost:4000';
const APP_URL = 'http://localhost:3000';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    /* Run your local dev server before starting the tests */
    webServer: [
        {
            command: 'pnpm --filter api run build && NODE_ENV=test pnpm --filter api run start:prod',
            url: API_URL,
            reuseExistingServer: !process.env.CI,
        },
        {
            command: 'NODE_ENV=test pnpm --filter client run build && NODE_ENV=test pnpm --filter client run start',
            url: APP_URL,
            reuseExistingServer: !process.env.CI,
        },
    ],
    testDir: './tests',
    /* Run tests in files in parallel */
    fullyParallel: false,
    workers: 1,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: process.env.CI ? 'list' : 'html',
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: APP_URL,
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
    },
    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
});
