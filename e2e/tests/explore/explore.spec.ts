import { test, Page, expect } from '@playwright/test'
import { Section } from '@shared/dto/sections/section.entity'
import { E2eTestManager } from '@shared/lib/e2e-test-manager'

test.describe.configure({ mode: 'serial' })

test.describe('Explore E2E', () => {
  let testManager: E2eTestManager
  let page: Page
  let sections: Section[]

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    testManager = await E2eTestManager.load(page)
  })

  test.beforeEach(async () => {
    const entityMocks = testManager.mocks()
    sections = [
      await entityMocks.createSection({
        slug: 'section-1',
        name: 'Section 1',
        description: ':)',
        order: 1
      }),
      await entityMocks.createSection({
        slug: 'section-2',
        name: 'Section 2',
        description: ':)',
        order: 2,
        baseWidgets: []
      })
    ]
  })

  test.afterEach(async () => {
    await testManager.clearDatabase()
  })

  test.afterAll(async () => {
    await testManager.close()
  })

  test('List all sections in the sidebar and main body', async () => {
    await page.goto('/explore')
    expect(await page.getByTestId('section-container').count()).toBe(sections.length)
    expect(await page.getByTestId('section-link').count()).toBe(sections.length)
  })
})
