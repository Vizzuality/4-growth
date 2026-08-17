/**
 * Wave data harmonization verification
 *
 * Two layers of verification:
 *
 * 1. Browser (sections API interception) — confirms the explore page loads the
 *    correct data and canonical labels reach the frontend.
 *
 * 2. API + ETL output (request fixture) — for every widgeted indicator, calls
 *    GET /widgets/:id?filters[data-source=survey] and compares each chart
 *    entry's count against counts computed directly from surveys.json and
 *    surveys-wave2.json. This validates the full pipeline:
 *    ETL JSON output → DB load → API → frontend.
 */

import { test, expect, Browser, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import ROUTES from '@shared/constants/routes';

// ─── Label allow/deny lists ────────────────────────────────────────────────

const FORBIDDEN_LABELS: Record<string, string[]> = {
  'type-of-stakeholder': [
    'Farmer/agricultural producers', 'Forester', 'Forest owner', 'Forest operator',
    'Forest product processor', 'Farming cooperative', 'Farming association',
    'Forestry association', 'Research institutes and research networks',
    'Digital technology provider', 'Service/information provider',
    'Infrastructure provider', 'Network organisation (National/European)',
  ],
  'network-connectivity-type': [
    'Cellular networks', 'Wireless internet', 'Wired internet', 'Private networks',
    'IoT networks', 'Low-power Wide-area network', 'Sattelite internet',
  ],
  'types-of-tools-or-platforms': [
    'Field Data Collection Apps', 'Precision Agriculture Technology',
    'Remote sensing platforms', 'Research Databases', 'Traceability systems',
    'IoT Devices', 'Forest Management Software',
  ],
  'type-of-data-collected': [
    'Crop and yield data', 'Financial and operational data', 'Inventory and equipment data',
    'Livestock data', 'Market and economic data', 'Pest and disease data',
    'Remote sensing and geospatial data', 'Soil data', 'Weather and environmental data',
  ],
  'primary-functions': [
    'Data management', 'Decision-making', 'Crop health and disease detection',
    'Production phase', 'Supply chain optimisation', 'Harvesting and distribution',
    'Planning and Management',
  ],
  'technology-type-agriculture': [
    'Farm Management Information Systems', 'Monitoring and tracking of livestock/crops',
    'Smart irrigation systems', 'Automated machinery and robotics',
  ],
  'technology-type-forestry': [
    'Drones for Forest Monitoring', 'Forest Fire Prediction and Monitoring systems',
  ],
  'primary-area-of-operation-in-agriculture': [
    'Crop cultivation - grains', 'Crop cultivation - fruits', 'Crop cultivation - horticulture',
    'Crop cultivation - vegetables', 'Crop cultivation - legumes',
    'Livestock farming - dairy', 'Livestock farming - meat', 'Livestock farming - other',
    'Farm management services', 'Agricultural machinery and equipment services',
    'Post-harvest handling services', 'Crop services', 'Plant propagation',
  ],
  'operate-without-data': ['Negligible impact'],
  'further-adoption-with-connectivity': ['Negligible impact'],
  'plans-to-expand-or-upgrade': ['Negligible impact'],
  'sustainability': ['Negligible impact'],
  'cost-savings-efficiency': ['Negligible impact'],
  'organisation-size': [
    'Micro (1-9 employees)', 'Small (10-49 employees)',
    'Medium (50-249 employees)', 'Large (250+ employees)', 'Not applicable*',
  ],
  'organisation-type': ['Small to Medium Entreprise'],
  'tech-provider-data-types': ['Geo-spatial data'],
};

const REQUIRED_LABELS: Record<string, string[]> = {
  'type-of-stakeholder': ['Producer (Farmer/Forest Owner/Forester)', 'Advisory group', 'NGO'],
  'network-connectivity-type': [
    'Cellular networks (e.g. 3G, 4G, 5G)', 'Wireless internet (Wi-Fi)',
    'Wired internet (e.g. DSL, Ethernet)',
    'Private networks (e.g. corporate or organizational networks)',
    'IoT specific Networks (e.g. LPWAN, LoRaWan, Zigbee)',
  ],
  'type-of-data-collected': [
    'Crop and Yield Data (e.g., production quantities, quality metrics)',
    'Weather and Environmental Data (e.g., temperature, precipitation, air quality)',
    'Soil Data (e.g., pH levels, nutrient content, moisture)',
  ],
  'types-of-tools-or-platforms': [
    'Farm and Forest Management Software (e.g., FMIS, forest management system)',
    'Field Data Collection Tools (e.g., mobile apps, handheld devices)',
    'IoT Devices and Sensors (e.g., soil moisture sensors, weather stations, livestock trackers)',
  ],
  'primary-functions': [
    'Production phase enhancement (e.g. optimizing yields, resource efficiency)',
    'Monitoring and surveillance (e.g. crop/forest health, pest detection, environmental conditions)',
    'Data collection and Management (e.g. data storage, analytics, dashboards)',
  ],
  'technology-type-agriculture': [
    'Robotic Systems or Smart Machines (e.g., drones or harvesting/weeding/planting/milking robots etc.)',
    'Farm Management Software (e.g., digital tools for holistic practical, operational or financial management of a farm etc.)',
  ],
  'technology-type-forestry': [
    'Field Survey Technologies (e.g., drones, ground sensors for soil/weather/fire prediction, GPS devices, Geographic Information Systems Software etc.)',
  ],
  'operate-without-data': ['Neither disagree nor agree'],
  'organisation-type': ['SME'],
  'tech-provider-data-types': ['Geospatial data'],
  'primary-area-of-operation-in-agriculture': [
    'Arable farming (grains, vegetables, legumes, fruits, plant propagation, etc.)',
    'Livestock farming (meat, dairy, other)',
  ],
};

// Some base_widget.question display texts differ from the ETL survey question texts.
// This map provides the correct ETL question text for those cases.
const ETL_QUESTION_OVERRIDE: Record<string, string> = {
  // base_widget.question = " What country the respondent's primary area of operation is located within?"
  // ETL surveys.json question = "Location (country/region)"
  'location-country-region': 'Location (country/region)',
  // base_widget.question = "How large is the respondent's operation/organisation in terms of personnel?"
  'organisation-size': 'Agriculture/forestry organisation size',
  // base_widget.question = "What application/primary sub-area of operation the respondent is active in within their respective sector?"
  'primary-area-of-operation-in-agriculture': 'Primary area of operation in agriculture',
  'primary-area-of-operation-in-forestry': 'Primary area of operation in forestry',
  // base_widget.question = "What type of stakeholder the respondent identifies as within their respective sector?"
  'type-of-stakeholder': 'Type of stakeholder',
};

// All 37 survey indicators (excludes total-countries and total-surveys counters)
const ALL_SURVEY_INDICATORS = [
  'adoption-of-technology-by-country', 'barriers', 'cost-savings-efficiency',
  'data-payments', 'data-recipients', 'data-sharing', 'data-storage',
  'digital-technologies-integrated', 'further-adoption-with-connectivity',
  'geographical-reach', 'level-of-reliability', 'location-country-region',
  'network-connectivity', 'network-connectivity-type', 'operate-without-data',
  'organisation-size', 'organisation-type', 'plans-to-expand-or-upgrade',
  'primary-area-of-operation-in-agriculture', 'primary-area-of-operation-in-forestry',
  'primary-functions', 'sector', 'sustainability', 'technology-type-agriculture',
  'technology-type-forestry', 'tech-provider-aftersales', 'tech-provider-agri-forestry-percentage',
  'tech-provider-cost-structure', 'tech-provider-data-types', 'tech-provider-market-penetration',
  'tech-provider-market-research', 'tech-provider-sales-model', 'tech-provider-user-priorities',
  'tech-provider-user-type', 'type-of-data-collected', 'type-of-stakeholder',
  'types-of-tools-or-platforms',
];

// ─── ETL output helpers ────────────────────────────────────────────────────

type SurveyRecord = { surveyId: string; question: string; answer: string };

/** Compute question → answer → unique-survey-id-count from ETL JSON output files. */
function buildEtlCounts(): Map<string, Map<string, number>> {
  const surveysDir = path.resolve(process.cwd(), '../api/data/surveys');
  const wave1: SurveyRecord[] = JSON.parse(
    fs.readFileSync(path.join(surveysDir, 'surveys.json'), 'utf-8'),
  );
  const wave2: SurveyRecord[] = JSON.parse(
    fs.readFileSync(path.join(surveysDir, 'surveys-wave2.json'), 'utf-8'),
  );

  // question → answer → Set<surveyId>
  const sets = new Map<string, Map<string, Set<string>>>();
  for (const record of [...wave1, ...wave2]) {
    if (!sets.has(record.question)) sets.set(record.question, new Map());
    const byAnswer = sets.get(record.question)!;
    if (!byAnswer.has(record.answer)) byAnswer.set(record.answer, new Set());
    byAnswer.get(record.answer)!.add(record.surveyId);
  }

  // Collapse Sets → counts
  const result = new Map<string, Map<string, number>>();
  for (const [q, byAnswer] of sets) {
    const counts = new Map<string, number>();
    for (const [a, ids] of byAnswer) counts.set(a, ids.size);
    result.set(q, counts);
  }
  return result;
}

// ─── Tests ────────────────────────────────────────────────────────────────

test.describe.configure({ mode: 'serial' });

test.describe('Wave data harmonization', () => {
  // Shared state populated in beforeAll
  let browser: Browser;
  let page: Page;
  let capturedFromSections: Record<string, string[]> = {};
  let etlCounts: Map<string, Map<string, number>>;

  test.beforeAll(async ({ browser: b }) => {
    browser = b;

    // Build expected counts from ETL output files once
    etlCounts = buildEtlCounts();

    // Navigate the page and intercept the /sections response
    page = await browser.newPage();
    capturedFromSections = {};

    await page.route('**/sections*', async (route) => {
      const response = await route.fetch();
      try {
        const json = await response.json();
        const sections = json?.data as
          | { baseWidgets?: { indicator: string; data: { chart?: { label: string }[] } }[] }[]
          | undefined;
        if (sections) {
          for (const section of sections) {
            for (const widget of section.baseWidgets ?? []) {
              const chart = widget.data?.chart;
              if (chart) {
                capturedFromSections[widget.indicator] = chart.map((r) => r.label);
              }
            }
          }
        }
      } catch { /* non-JSON */ }
      await route.fulfill({ response });
    });

    await page.goto(`/${ROUTES.surveyAnalysis.explore}`, { waitUntil: 'networkidle' });
    await page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }),
    );
    await page.waitForTimeout(3000);
  });

  test.afterAll(async () => {
    await page.close();
  });

  // ── Layer 1: browser label checks ───────────────────────────────────────

  test('All key indicator widgets loaded on the explore page', () => {
    const checked = [
      ...new Set([...Object.keys(FORBIDDEN_LABELS), ...Object.keys(REQUIRED_LABELS)]),
    ];
    for (const indicator of checked) {
      expect(
        capturedFromSections[indicator],
        `Widget "${indicator}" did not load on the explore page`,
      ).toBeDefined();
    }
  });

  for (const [indicator, forbidden] of Object.entries(FORBIDDEN_LABELS)) {
    test(`"${indicator}" has no pre-harmonization labels`, () => {
      const labels = capturedFromSections[indicator] ?? [];
      for (const bad of forbidden) {
        expect(labels, `Old label "${bad}" still present in "${indicator}"`).not.toContain(bad);
      }
    });
  }

  for (const [indicator, required] of Object.entries(REQUIRED_LABELS)) {
    test(`"${indicator}" shows expected canonical labels`, () => {
      const labels = capturedFromSections[indicator] ?? [];
      for (const canonical of required) {
        expect(
          labels,
          `Canonical label "${canonical}" missing from "${indicator}"`,
        ).toContain(canonical);
      }
    });
  }

  // ── Layer 2: ETL output → API count comparison (survey data only) ────────

  for (const indicator of ALL_SURVEY_INDICATORS) {
    test(`"${indicator}" API counts match ETL output`, async ({ request }) => {
      const res = await request.get(`http://localhost:4000/widgets/${indicator}`, {
        params: {
          'filters[0][name]': 'data-source',
          'filters[0][operator]': '=',
          'filters[0][values][0]': 'survey',
        },
      });

      expect(res.ok(), `GET /widgets/${indicator} returned ${res.status()}`).toBeTruthy();
      const json = await res.json();

      // Map widget (adoption-of-technology-by-country) uses a `map` field, not `chart`
      const chart = json?.data?.data?.chart as { label: string; value: number }[] | undefined;
      if (!chart) {
        // Counter or map widget — just assert the response is not empty
        const counter = json?.data?.data?.counter ?? json?.data?.data?.map;
        expect(counter, `"${indicator}" returned no chart or counter data`).toBeDefined();
        return;
      }

      const apiQuestion = json?.data?.question as string;
      expect(apiQuestion, `"${indicator}" has no question field`).toBeTruthy();

      const question = ETL_QUESTION_OVERRIDE[indicator] ?? apiQuestion;
      const expectedByAnswer = etlCounts.get(question);
      expect(
        expectedByAnswer,
        `Question "${question}" (indicator: "${indicator}") not found in ETL output files`,
      ).toBeDefined();

      for (const { label, value } of chart) {
        const expected = expectedByAnswer!.get(label) ?? 0;
        expect(
          value,
          `"${indicator}" / "${label}": API returned ${value} but ETL output has ${expected}`,
        ).toBe(expected);
      }

      // Also verify no ETL answer is silently missing from the API response
      const apiLabels = new Set(chart.map((r) => r.label));
      for (const [answer, count] of expectedByAnswer!) {
        if (count > 0) {
          expect(
            apiLabels.has(answer),
            `"${indicator}" / "${answer}": present in ETL output (${count} surveys) but missing from API response`,
          ).toBeTruthy();
        }
      }
    });
  }

  // ── Layer 3: counter widgets ─────────────────────────────────────────────

  test('total-surveys count is in expected range (1700–2000)', async ({ request }) => {
    const res = await request.get('http://localhost:4000/widgets/total-surveys');
    const total = (await res.json())?.data?.data?.counter?.value as number;
    expect(total).toBeGreaterThanOrEqual(1700);
    expect(total).toBeLessThanOrEqual(2000);
  });

  test('total-countries is 20', async ({ request }) => {
    const res = await request.get('http://localhost:4000/widgets/total-countries');
    const count = (await res.json())?.data?.data?.counter?.value as number;
    expect(count).toBe(20);
  });
});
