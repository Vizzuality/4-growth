import { test, expect } from "@playwright/test";
import {E2eTestManager} from "@shared/lib/e2e-test-manager";
import { CreateUserDto } from "@shared/dto/users/create-user.dto";

let testManager: E2eTestManager;

test.beforeAll(async () => {
    testManager = await E2eTestManager.load();
});

test.beforeEach(async () => {
    await testManager.clearDatabase();
});

test.afterEach(async () => {
    await testManager.clearDatabase();
});

test.afterAll(async () => {
    await testManager.close();
});

test('an user signs up successfully', async ({ page }) => {
    const user: CreateUserDto = {
        email: "johndoe@test.com",
        password: "password"   
    };

    await page.goto('/auth/signup');

    await page.getByLabel('Email').fill(user.email);
    await page.locator('input[type="password"]').fill(user.password);
    await page.getByRole('checkbox').check();
    
    await page.getByRole('button', { name: /sign up/i }).click();

    await page.waitForURL('/auth/signin');

    await page.getByLabel('Email').fill(user.email);
    await page.locator('input[type="password"]').fill(user.password);

    await page.getByRole('button', { name: /log in/i }).click();

    await page.waitForURL('/profile')
    await expect(await page.locator('input[type="email"]')).toHaveValue(user.email);
});

test('an user signs in successfully', async ({ page }) => {
    const user: CreateUserDto = {
        email: "jhondoe@test.com",
        password: "12345678"   
    }
    
    await testManager.createUser({ email: user.email });

    await page.goto('/auth/signin');
    await page.getByLabel('Email').fill(user.email);
    await page.locator('input[type="password"]').fill(user.password);
    await page.getByRole('button', { name: /log in/i }).click();

    await page.waitForURL('/profile')
    await expect(await page.locator('input[type="email"]')).toHaveValue(user.email);
})