import { test, expect } from "@playwright/test";
import {E2eTestManager} from "@shared/lib/e2e-test-manager";

let testManager: E2eTestManager;

test.beforeAll(async () => {
    testManager = await E2eTestManager.load();
});

test.afterEach(async () => {
    await testManager.clearDatabase();
});

test.afterAll(async () => {
    await testManager.close();
});

test('an user signs up successfully', async ({ page }) => {
    const user = {
        email: "johndoe@test.com",
        username: "John Doe",
        password: "password"   
    };

    await page.goto('/auth/signin');

    await page.getByRole('button', { name: /sign up instead/i }).click();

    await page.getByLabel('Username').fill('John Doe');
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password').fill(user.password);

    await page.getByRole('button', { name: /submit/i }).click();

    await page.getByRole('button', { name: /sign in instead/i }).click();

    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password').fill(user.password);

    await page.getByRole('button', { name: /submit/i }).click();

    await page.waitForURL('/profile')

    await expect(page.getByText(user.email)).toHaveText(user.email);
    await expect(page.getByText(user.username)).toHaveText(user.username);
});

test('an user signs in successfully', async ({ page }) => {
    const user = {
        email: "jhondoe@test.com",
        username: "John Doe",
        password: "12345678"   
    }
    
    await testManager.createUser({ email: user.email, username: user.username });

    await page.goto('/auth/signin');
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password').fill(user.password);   
    await page.getByRole('button', { name: /submit/i }).click();

    await page.waitForURL('/profile')
    await expect(page.getByText(user.email)).toHaveText(user.email);
    await expect(page.getByText(user.username)).toHaveText(user.username);
})