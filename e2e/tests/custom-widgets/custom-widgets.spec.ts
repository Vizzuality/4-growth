import { test, expect, Page } from "@playwright/test";
import { E2eTestManager } from "@shared/lib/e2e-test-manager";
import { User } from "@shared/dto/users/user.entity";
import { CustomWidget } from "@shared/dto/widgets/custom-widget.entity";

test.describe.configure({ mode: "serial" });

test.describe("Custom Charts E2E", () => {
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

  test.describe("List Custom Charts", () => {
    let customCharts: CustomWidget[] = [];
    test.beforeEach(async () => {
      for (const n of Array(10).keys()) {
        customCharts.push(
          await testManager.mocks().createCustomWidget({
            name: `Test chart ${n}`,
            user: { id: user.id },
          })
        );
      }
    });
    test("a user can see a list of custom charts", async () => {
      // TODO: Implement test for listing created charts
    });
  });
  test.describe("Rename Custom Chart", () => {
    test("a user can rename a custom chart", async () => {
      const CustomWidget = await testManager
        .mocks()
        .createCustomWidget({ user: { id: user.id } });
      await page.goto("/profile");
      await page
        .getByRole("cell", { name: CustomWidget.defaultVisualization })
        .getByRole("button")
        .click();
      await page.getByRole("button", { name: "Rename" }).click();
      await page.locator('input[type="text"]').fill("Cahnge");
      await page.locator('input[type="text"]').press("Enter");
      await expect(page.getByRole("status").first()).toHaveText(
        "Visualization updated successfully."
      );
    });
  });
  test.describe("Delete Custom Chart", () => {
    test("a user can delete a custom chart", async () => {
      const CustomWidget = await testManager
        .mocks()
        .createCustomWidget({ user: { id: user.id } });
      await page.goto("/profile");
      await page
        .getByRole("cell", { name: CustomWidget.defaultVisualization })
        .getByRole("button")
        .click();
      await page.getByRole("button", { name: "Delete", exact: true }).click();
      await page.getByRole("button", { name: "Delete visualization" }).click();
      await expect(page.getByRole("status").first()).toHaveText(
        "Visualization removed successfully."
      );
      // await page.getByRole('status').click();
      // await page.getByText('Visualization removed').click();
    });
  });
});
