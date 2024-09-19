import { test, Page, expect } from '@playwright/test'
import { E2eTestManager } from '@shared/lib/e2e-test-manager'

test.describe.configure({ mode: 'serial' })

test.describe('Explore E2E', () => {
  let testManager: E2eTestManager
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    testManager = await E2eTestManager.load(page)
  })

  test.afterEach(async () => {
    await testManager.clearDatabase()
  })

  test.afterAll(async () => {
    await testManager.close()
  })

  // TODO: Fix test
  // test('List all sections in the sidebar and main body', async () => {
  //   const entityMocks = testManager.mocks()
  //   const sections = [
  //     await entityMocks.createSection({
  //       slug: 'section-1',
  //       name: 'Section 1',
  //       description: ':)',
  //       order: 1
  //     }),
  //     await entityMocks.createSection({
  //       slug: 'section-2',
  //       name: 'Section 2',
  //       description: ':)',
  //       order: 2
  //     })
  //   ]
  //   await page.goto('/explore')
  //   expect(await page.getByTestId('section-container').count()).toBe(sections.length)
  //   expect(await page.getByTestId('section-link').count()).toBe(sections.length)
  // })
})
