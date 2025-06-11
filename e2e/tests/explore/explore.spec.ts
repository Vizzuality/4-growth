import { test as base, expect } from '@playwright/test';
import { Section } from '@shared/dto/sections/section.entity';
import { PageFilter } from '@shared/dto/widgets/page-filter.entity';
import { E2eTestManager } from '@shared/lib/e2e-test-manager';
import ROUTES from '@shared/constants/routes';

type TestFixtures = {
  testManager: E2eTestManager;
  sections: Section[];
  requiredFilter: PageFilter;
};

const test = base.extend<TestFixtures>({
  testManager: async ({ page }, use) => {
    const manager = await E2eTestManager.load(page);
    await use(manager);
    await manager.close();
  },

  sections: async ({ testManager }, use) => {
    const sections = await testManager.dataSource.getRepository(Section).find();

    if (sections.length === 0) {
      throw new Error('No sections found in the database');
    }

    await use(sections);
  },

  requiredFilter: async ({ testManager }, use) => {
    const filter = await testManager.dataSource
      .getRepository(PageFilter)
      .findOne({ where: { name: 'sector' } });

    if (!filter) {
      throw new Error('Missing filter with name "sector"');
    }

    await use(filter);
  },
});

test.describe.configure({ mode: 'serial' });

test.describe('Explore E2E', () => {
  test.describe('Section Navigation', () => {
    test('List all sections as anchor links and section elements', async ({
      page,
      sections,
    }) => {
      const count = sections.length;

      await page.goto(`/${ROUTES.surveyAnalysis.explore}`);
      await expect(
        page.locator('#sidebar-sections-list').locator('a'),
      ).toHaveCount(count);
      await expect(
        page.locator('#in-page-sections-list').locator('a'),
      ).toHaveCount(count);
      await expect(
        page.locator('#sections-container').locator('section'),
      ).toHaveCount(count);
    });

    test('Should scroll to the correct section when clicking anchor links', async ({
      page,
    }) => {
      await page.goto(`/${ROUTES.surveyAnalysis.explore}`);
      const sections = await page
        .locator('#sidebar-sections-list')
        .locator('a')
        .all();

      for (const link of sections) {
        const href = await link.getAttribute('href');
        const targetSectionId = href?.replace('#', '');

        await link.click();
        await expect(page).toHaveURL(new RegExp(`${href}$`));

        const targetSection = page.locator(`#${targetSectionId}`);
        await expect(targetSection).toBeInViewport();
      }
    });

    test('Should handle direct anchor navigation and browser history', async ({
      page,
      sections,
    }) => {
      const lastSection = sections[sections.length - 1];

      // Direct URL navigation
      await page.goto(`/${ROUTES.surveyAnalysis.explore}#${lastSection.slug}`);

      const targetSection = page.locator(`#${lastSection.slug}`);
      await expect(targetSection).toBeInViewport();

      await page.goto(`/${ROUTES.surveyAnalysis.explore}`);

      // Test in-page anchor link
      const links = await page
        .locator('#in-page-sections-list')
        .locator('a')
        .all();
      const lastLink = links[links.length - 1];

      const lastLinkHref = await lastLink.getAttribute('href');
      const lastLinkTargetId = lastLinkHref?.replace('#', '');

      await lastLink.click();

      await expect(page).toHaveURL(new RegExp(`${lastLinkHref}$`));
      const lastLinkTarget = page.locator(`#${lastLinkTargetId}`);
      await expect(lastLinkTarget).toBeInViewport();

      await page.goBack();
      await expect(page).not.toHaveURL(new RegExp(`${lastLinkHref}$`));

      await page.goForward();
      await expect(page).toHaveURL(new RegExp(`${lastLinkHref}$`));
      await expect(lastLinkTarget).toBeInViewport();
    });
  });

  // TODO: Does currently not work + have to update filter select component
  // test.describe('Section filters', () => {
  //   test('Should apply filtering when a filter is selected', async ({
  //     page,
  //     requiredFilter,
  //   }) => {
  //     await page.goto(`/${ROUTES.surveyAnalysis.explore}`);

  //     await page.getByRole('button', { name: 'Filters' }).click();
  //     await page.getByRole('button', { name: 'Add a custom filter' }).click();
  //     await page.getByRole('button', { name: requiredFilter.name }).click();

  //     await page.getByRole('button', { name: /Select values/i }).click();
  //     await page
  //       .getByRole('checkbox', { name: requiredFilter.values[0] })
  //       .click();
  //     await page.getByRole('button', { name: 'Apply' }).click();
  //   });
  // });
});
