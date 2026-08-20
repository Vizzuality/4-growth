# Wave Harmonization Decisions

This document summarises all the decisions made to harmonize the answer vocabularies across Wave 1+3 and Wave 2 survey data. The goal is that when data from both waves is shown together in the platform, the same concept always appears under the same label — no duplicate bars, no phantom entries.

The final section documents the five decisions that required team input, along with the chosen approach for each.

---

## Why harmonization matters

Wave 1+3 and Wave 2 were designed at different times. The survey vocabulary evolved between waves — some questions were rephrased, answer options were renamed or expanded, and a few old labels survived alongside their new equivalents. Without normalization, a chart showing "Type of stakeholder" would show "Farmer/agricultural producers" and "Producer (Farmer/Forest Owner/Forester)" as two separate bars, even though they mean the same thing.

The rule we applied throughout: **always use the most descriptive label**, regardless of which wave it came from.

---

## What we fixed

### 1. Likert → Yes/No answers on four questions

Wave 3 respondents (who share the Wave 1+3 pipeline) answered four yes/no questions using a Likert agree/disagree scale instead. Wave 2 already had these as Yes/Not at all/Don't know. We normalized the Wave 1+3 Likert answers to match:

- Strongly agree / Agree → **Yes**
- Strongly disagree / Disagree → **Not at all**
- Neither disagree nor agree → **Don't know**

Affected questions:

- Are there plans to expand or upgrade your current digital infrastructure?
- Would you further adopt digital technologies if you had better network connectivity?
- Have digital technologies contributed to sustainability and environmental practices?
- Have digital technologies resulted in cost savings or increased efficiency?

"Negligible impact" on all four questions was normalized to **"Not at all"** for consistency. "Not Applicable" from Wave 2 on these questions was normalized to **"Don't know"** — see decisions 4 and 5 below for the full rationale.

---

### 2. "Would you be able to operate without this data?" — neutral option

This question uses a full Likert scale in both waves (Strongly agree → Strongly disagree), but the neutral middle option has different names:

- Wave 1+3: **"Negligible impact"** (134 answers)
- Wave 2: **"Neither disagree nor agree"** (216 answers)

Unlike the four yes/no questions above, here the neutral option genuinely means the same thing in both waves. We mapped "Negligible impact" → **"Neither disagree nor agree"** for this question only.

---

### 3. "What type of data do you collect?" — short labels expanded

Wave 1 used abbreviated labels; Wave 2 used full descriptive ones. All 9 short labels normalized to their long canonical forms:

| Was | Now |
| --- | --- |
| Crop and yield data | Crop and Yield Data (e.g., production quantities, quality metrics) |
| Financial and operational data | Financial and Operational Data (e.g., expenses, profits, workflow efficiency) |
| Inventory and equipment data | Inventory and Equipment Data (e.g., machinery status, stock levels) |
| Livestock data | Livestock Data (e.g., health, productivity, breeding) |
| Market and economic data | Market and Economic Data (e.g., prices, demand trends, cost analysis) |
| Pest and disease data | Pest and Disease Data (e.g., infestations, outbreaks, treatments) |
| Remote sensing and geospatial data | Remote Sensing and Geospatial Data (e.g., satellite imagery, GIS mapping) |
| Soil data | Soil Data (e.g., pH levels, nutrient content, moisture) |
| Weather and environmental data | Weather and Environmental Data (e.g., temperature, precipitation, air quality) |

---

### 4. "What are the primary functions of these technologies...?" — short labels expanded

8 of 9 Wave 1+3 short labels mapped to their long canonical forms:

| Was | Now |
| --- | --- |
| Crop health and disease detection | Crop/Forest Health and disease detection (e.g. early detection via sensors or drones) |
| Data management | Data collection and Management (e.g. data storage, analytics, dashboards) |
| Decision-making | Decision-making Support (e.g. AI/ML models for recommendations) |
| Harvesting and distribution | Harvesting and distribution (e.g. automated machinery, tranportation tracking) |
| Monitoring | Monitoring and surveillance (e.g. crop/forest health, pest detection, environmental conditions) |
| Planning and Management | Planning and Management (e.g. Resource allocation, inventory management) |
| Production phase | Production phase enhancement (e.g. optimizing yields, resource efficiency) |
| Supply chain optimisation | Supply chain optimisation (e.g. logistics, traceability, post-harvest handling) |

**"On-farm activities" (9 answers):** left as-is. No equivalent label exists in Wave 2 and there is no unambiguous mapping to any of the canonical options.

---

### 5. "What type of tools or platforms do you use to collect data?" — label consolidation

6 short labels expanded, and 3 agriculture/forestry-specific software labels merged:

| Was | Now |
| --- | --- |
| Field Data Collection Apps | Field Data Collection Tools (e.g., mobile apps, handheld devices) |
| IoT Devices | IoT Devices and Sensors (e.g., soil moisture sensors, weather stations, livestock trackers) |
| Precision Agriculture Technology | Precision Agriculture and Forestry Technology (e.g., variable rate technology, GPS-guided equipment) |
| Remote sensing platforms | Remote Sensing Platforms (e.g., drones, satellites) |
| Research Databases | Research Data platforms (e.g., academic databases) |
| Traceability systems | Traceability and Supply Chain Systems (e.g., blockchain for tracking produce, timber certification systems) |
| Farm Management Software | Farm and Forest Management Software (e.g., FMIS, forest management system) |
| Farm Management Software (e.g., digital tools for holistic practical...) | Farm and Forest Management Software (e.g., FMIS, forest management system) |
| Forest Management Software | Farm and Forest Management Software (e.g., FMIS, forest management system) |

The three farm/forest management software variants were merged into the combined canonical label because they all refer to the same category of tool. Keeping them separate would prevent any cross-wave comparison for that option.

**Left as-is:** "Forest Inventory Tools" (24 answers) and "Monitoring" (4 answers) — no Wave 2 equivalent exists for either.

---

### 6. "What network connectivity do you use?" — variant consolidation

Wave 1+3 had 8 broken or inconsistent variants of network connectivity labels, some with typos, some abbreviated, and one where the question text itself bled into the answer field in the source data. All normalized:

| Was | Now |
| --- | --- |
| Cellular networks | Cellular networks (e.g. 3G, 4G, 5G) |
| What network connectivity do you use? - Cullular networks (e.g. 3G, 4G, 5G) | Cellular networks (e.g. 3G, 4G, 5G) |
| IoT networks | IoT specific Networks (e.g. LPWAN, LoRaWan, Zigbee) |
| Low-power Wide-area network | IoT specific Networks (e.g. LPWAN, LoRaWan, Zigbee) |
| Private networks | Private networks (e.g. corporate or organizational networks) |
| Sattelite internet | Satellite internet |
| Wired internet | Wired internet (e.g. DSL, Ethernet) |
| Wireless internet | Wireless internet (Wi-Fi) |

**Note on canonical direction:** for "Private networks", the Wave 1+3 label is actually *more* descriptive than Wave 2's short "Private networks". So here we normalized Wave 2 to match Wave 1+3 — not the other way around.

**Note on the "Cullular networks" entry:** this is a source data quality issue. The answer description in the OData system was stored as the full question text + answer + a typo. Our normalization corrects it to the proper label.

---

### 7. "Type of stakeholder" — old granular labels → grouped canonical

Wave 1+3 had old granular stakeholder labels that were later grouped into broader canonical categories. 13 labels normalized:

| Was | Now |
| --- | --- |
| Farmer/agricultural producers | Producer (Farmer/Forest Owner/Forester) |
| Forest owner | Producer (Farmer/Forest Owner/Forester) |
| Forester | Producer (Farmer/Forest Owner/Forester) |
| Forest operator | Producer (Farmer/Forest Owner/Forester) |
| Research institutes and research networks | Research/Academic organisation |
| Digital technology provider | Data/Technology/Service Provider |
| Service/information provider | Data/Technology/Service Provider |
| Infrastructure provider | Data/Technology/Service Provider |
| Forest product processor | Processor (Forest/Agricultural products) |
| Farming cooperative | Cooperative/Association |
| Farming association | Cooperative/Association |
| Forestry association | Cooperative/Association |
| Network organisation (National/European) | Network organisation |

**"NGO/Advisory group" (1 answer):** left as-is — the respondent may genuinely fit both categories, and merging into either label would be a guess.

---

### 8. "What type of digital technology has been used for agriculture?" — old labels mapped

5 old Wave 1+3 labels mapped to current canonical forms:

| Was | Now |
| --- | --- |
| Automated machinery and robotics | Robotic Systems or Smart Machines (e.g., drones or harvesting/weeding/planting/milking robots etc.) |
| Automated machinery and robotics 1 | Robotic Systems or Smart Machines (e.g., drones or harvesting/weeding/planting/milking robots etc.) |
| Farm Management Information Systems | Farm Management Software (e.g., digital tools for holistic practical, operational or financial management of a farm etc.) |
| Monitoring and tracking of livestock/crops | Recording and Mapping Technologies (e.g., mapping or sensor-based monitoring of crops/soil/animals/weather conditions etc.) |
| Smart irrigation systems | Map or Sensor-based Variable Rate Technologies (e.g., advice or automatic variable application of fertilizers, persiticides, or irrigation etc.) |

**Left as-is:** "Precision farming" (12 answers) and "Smart-agri apps" (6 answers) — both are too ambiguous to map to a single canonical label without risking incorrect grouping.

---

### 9. "What type of digital technology has been used for forestry?" — old labels mapped

2 old Wave 1+3 labels mapped:

| Was | Now |
| --- | --- |
| Drones for Forest Monitoring | Field Survey Technologies (e.g., drones, ground sensors for soil/weather/fire prediction, GPS devices, Geographic Information Systems Software etc.) |
| Forest Fire Prediction and Monitoring systems | Field Survey Technologies (e.g., drones, ground sensors for soil/weather/fire prediction, GPS devices, Geographic Information Systems Software etc.) |

**Left as-is:** "Forest Inventory Management Software" (15 answers) — no Wave 2 equivalent. "Automated machinery and robotics 1" (1 answer) — data entry artifact, no forestry robotics category.

---

### 10. Blank placeholder answers — filtered out

35 Wave 1+3 answers with value "blank" removed from the output. These are system placeholders (a specific answer ID in the OData source whose description is literally "blank") recorded when a respondent left a question empty. They are not real responses. The affected surveys receive N/A for those questions instead.

Affected questions: "Where and how do you store this data?" (24), "What type of users do you primarily provide your technology to?" (8), "What type of organisation are you?" (2), "Do you offer any after-sales service, support, or warranty..." (1).

---

### 11. "Primary area of operation in agriculture" — old granular labels → grouped canonical

Wave 1+3 had 14 old granular labels alongside 6 canonical grouped ones. We confirmed via survey date metadata (CalendarID) that the granular labels came from an earlier version of the survey (calendar range 22549–22604) before the vocabulary was updated. The grouped canonical labels explicitly name the granular ones in their descriptions, making the mapping unambiguous.

| Old granular labels | Now |
| --- | --- |
| Crop cultivation - grains, fruits, legumes, vegetables, horticulture; Plant propagation | Arable farming (grains, vegetables, legumes, fruits, plant propagation, etc.) |
| Livestock farming - dairy, meat, other | Livestock farming (meat, dairy, other) |
| Farm management services; Agricultural machinery and equipment services; Post-harvest handling services; Crop services | Service and support (farm management services, crop services, post-harvesting handling services, etc.) |
| Other namely 1 | Other namely |

---

### 12. "What type of organisation are you?" — SME typo fixed

Wave 1+3 had "Small to Medium Entreprise" (misspelled, 18 answers). Wave 2 had "SME" (19 answers). Canonical label chosen: **"SME"** — avoids the typo debate entirely and is already the Wave 2 standard.

---

### 13. Wave 2 minor fixes

Three small Wave 2 answer issues corrected:

- **"Geo-spatial data" → "Geospatial data"** (21 answers, "What types of data do your products or services generate or rely on?") — unnecessary hyphen removed to match Wave 1+3.
- **After-sales extra comma removed** (14 answers) — "No, we do not offer after-sales**,** service, support, or warranty" had an extra comma after "after-sales". Corrected to "No, we do not offer after-sales service, support, or warranty".
- **"Private networks" → "Private networks (e.g. corporate or organizational networks)"** (26 answers, "What network connectivity do you use?") — Wave 1+3's longer form is more descriptive, so Wave 2 was normalized to match it.

---

## Decisions made after team input

### 1. Agriculture/forestry organisation size — geographic scale as canonical

**Question:** `Agriculture/forestry organisation size`

**Decision:** Use the geographic scale labels (Small-scale/Local, Medium-scale/Local-National, Large-scale/National-International) as the canonical set. Wave 2's employee-count brackets are mapped into them:

| Wave 2 label | Now |
| --- | --- |
| Micro (1-9 employees) | Small-scale/Local |
| Small (10-49 employees) | Small-scale/Local |
| Medium (50-249 employees) | Medium-scale/Local-National |
| Large (250+ employees) | Large-scale/National-International |
| Not applicable* | N/A |

The 82 Wave 1+3 answers already using the geographic scale labels are kept as-is. "Individual farmer/forester" (Wave 2 only) is also kept as-is — no equivalent exists in Wave 1+3.

---

### 2. Percentage of products targeted at agri/forestry — harmonized to Wave 2 bracket format

**Question:** `What percentage of your products or services are specifically targeted at the agricultural and forestry sectors?`

**Decision:** Wave 2 bracket ranges are the canonical format. Wave 1+3 exact values are normalized to their corresponding brackets in the ETL layer (`WAVE1_ANSWER_NORMALIZATIONS` in `transform.ts`). Wave 2 rows are no longer excluded from the DB — their bracket values pass through verbatim. All waves store bracket values in the `answer` column.

| Wave 1+3 exact | Canonical (Wave 2 bracket) |
| --- | --- |
| `90%` | `>90%` |
| `75%` | `<75%` |
| `25%` | `<25%` |
| — | `<50%` (Wave 2 only) |

---

### 3. "NGO/Advisory group" — left as-is

**Question:** `Type of stakeholder`

**Decision:** The single "NGO/Advisory group" answer is left as its own entry. Mapping it to either "NGO" or "Advisory group" would be an arbitrary choice — the respondent may genuinely fit both categories, and there is no basis for preferring one over the other.

---

### 4. "Negligible impact" on the four yes/no questions — normalized to "Not at all"

**Decision:** All four occurrences of "Negligible impact" across the four questions are normalized to **"Not at all"** for consistency. While the answer carries some nuance on cost savings and sustainability questions, uniform treatment produces cleaner cross-wave charts and avoids introducing a fifth bar that would appear on Wave 1+3 only.

Affected questions:
- Would you further adopt digital technologies if you had better network connectivity?
- Are there plans to expand or upgrade your current digital infrastructure?
- Have digital technologies contributed to sustainability and environmental practices?
- Have digital technologies resulted in cost savings or increased efficiency?

---

### 5. "Not Applicable" from Wave 2 — normalized to "Don't know"

**Decision:** Wave 2's "Not Applicable" Likert escape option is normalized to **"Don't know"**. The intent — the question does not apply to the respondent's context — is closest to inability to assess, which is what "Don't know" represents in both waves.

Affected questions and counts:
- Have digital technologies resulted in cost savings or increased efficiency? (59 answers)
- Are there plans to expand or upgrade your current digital infrastructure? (47 answers)
- Have digital technologies contributed to sustainability and environmental practices? (1 answer — negligible)

---

*Branch: `feat/integrate-cleaned-wave1-wave3-along-new-wave2`*