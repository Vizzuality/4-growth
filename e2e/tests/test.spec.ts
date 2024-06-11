import { test, expect } from "@playwright/test";
import {User} from "@shared/dto/users/user.entity";
import {E2eTestManager} from "@shared/lib/e2e-test-manager";



let testManager: E2eTestManager;

test.beforeAll(async () => {
    testManager = await E2eTestManager.load();
});

test.beforeEach(async () => {
    await testManager.clearDatabase();
});

test.afterAll(async () => {
    await testManager.close();
});

test("a user can login", async () => {
    const user = await testManager.createUser({ email: "e2e@test.com", password: "12345678" });
    expect(user?.email).toEqual("e2e@test.com");
    expect(true).toBeTruthy();
});

test("if its parallel this should blow", async () => {

    await testManager.createUser({ email: "e2e@test.com" });
    expect(true).toBeTruthy();
});

test('list users', async () => {
    for (const user of [1,2,3,4]){
        await testManager.createUser({ email: user + "@test.com" });
    }
    const user = await testManager.getDataSources().getRepository(User).find();

    expect(user.length).toEqual(4);
    user.map((u, i) => {
        expect(u.email).toEqual((i+1) + "@test.com");
    });
});


