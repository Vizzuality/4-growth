# 4Growth data API

The 4Growth Visualisation Platform reads its survey and projection data from a public REST API.
Partners can call the same API directly, without credentials, to show the data on their own
platforms.

This guide describes the public, read-only data endpoints. The examples were run against
production on 16 November 2026.

- [Access](#access)
- [Endpoints](#endpoints)
- [Filtering](#filtering)
- [Response formats](#response-formats)
- [What the data means](#what-the-data-means)
- [Data updates](#data-updates)
- [Survey indicators](#survey-indicators)
- [Projection indicators](#projection-indicators)

## Access

| | |
| :--- | :--- |
| Base URL | `https://visualisation.4growth-project.eu/api` |
| Authentication | None for the endpoints in this guide |
| Methods | `GET` only |
| Formats | JSON (`application/json; charset=utf-8`), and CSV for the export endpoints |
| CORS | Open (`Access-Control-Allow-Origin: *`), so browsers can call it directly |
| Versioning | None. There is one live version of the API |
| Rate limiting | None. Please cache responses and avoid frequent polling |

A quick check that the API is reachable:

```bash
curl https://visualisation.4growth-project.eu/api/health
```

```json
{"status":"ok","info":{"database":{"status":"up"}},"error":{},"details":{"database":{"status":"up"}}}
```

The API also has `/auth/*` and `/users/*` routes. They serve the platform's user accounts and are
not part of the data API. The `/auth/*` routes (`sign-up`, `sign-in` and `recover-password`) are
public, because they are how an account is created and a login token obtained. The `/users/*`
routes need that login token.

## Endpoints

The data comes in two families. **Survey** data is served per indicator, which the API calls a
*widget*. **Projection** data holds market projections for 2020–2040 under four scenarios.

| Endpoint | Returns |
| :--- | :--- |
| `GET /filters` | Survey filters and their current values |
| `GET /sections` | All 11 sections, each with its indicators and their data |
| `GET /widgets` | List of survey indicators (metadata only, no data) |
| `GET /widgets/{indicator}` | One survey indicator with its data |
| `GET /widgets/{indicator}/export` | The same data as a CSV file |
| `GET /projections/filters` | Projection filters and their values |
| `GET /projections/widgets` | The six projection indicators with their yearly data |
| `GET /projections/widgets/{id}/export` | One projection indicator as a CSV file |
| `GET /projections/custom-widget/settings` | The options accepted by the custom projection |
| `GET /projections/custom-widget` | A projection built from the indicator and dimension you choose |
| `GET /projections/custom-widget/export` | The custom projection as a CSV file |

### Survey endpoints

#### `GET /filters`

Returns every survey filter as `{ name, label, values }`. Use it to find valid filter names and
values. The values are read from the live data, so they can change when data is updated.

| Parameter | Description |
| :--- | :--- |
| `filters` | Optional. Narrows each filter's values to those found in the matching surveys. See [Filtering](#filtering) |

#### `GET /sections`

Returns the 11 sections in order. Each section has `order`, `slug`, `name`, `description` and
`baseWidgets`, a list of the section's indicators with their `data`. This is the whole survey
dataset in one call (about 36 KB), and is not paginated.

| Parameter | Description |
| :--- | :--- |
| `filters` | Optional. Applied to the data of every indicator |

This endpoint does not accept `fields`, `sort` or pagination parameters.

#### `GET /widgets`

Lists the survey indicators with their metadata: `indicator`, `title`, `question`,
`questionTitle`, `description`, `sectionOrder`, `visualisations`, `defaultVisualization`,
`createdAt` and `updatedAt`. It does not include data.

| Parameter | Description |
| :--- | :--- |
| `pageSize` | Items per page. Default 25 |
| `pageNumber` | Page to return, starting at 1 |
| `disablePagination` | Send `disablePagination=true` to get all items in one response. Leave it out to paginate: any value, including `false`, turns pagination off |
| `visualisations[]` | Keeps the indicators that support all the listed visualisation types, for example `visualisations[]=map` |
| `fields[]` | Returns only the listed fields, for example `fields[]=indicator&fields[]=title` |
| `sort[]` | Sorts by a field. Prefix the name with `-` for descending order, for example `sort[]=-indicator` |

#### `GET /widgets/{indicator}`

Returns one indicator's metadata plus a `data` object. `{indicator}` is the text id, for example
`type-of-stakeholder`. The [indicator list](#survey-indicators) has all 39.

| Parameter | Description |
| :--- | :--- |
| `filters` | Optional. See [Filtering](#filtering) |
| `breakdown` | Optional. The id of a second indicator to split the results by, for example `breakdown=sector`. When set, `data` holds only `breakdown` |

An unknown indicator returns 404. An unknown `breakdown` id returns an empty `breakdown` list.

```bash
curl -g "https://visualisation.4growth-project.eu/api/widgets/total-surveys?filters[0][name]=location-country-region&filters[0][operator]==&filters[0][values][0]=Belgium"
```

```json
{
  "data": {
    "indicator": "total-surveys",
    "title": "Total number of surveys",
    "question": "",
    "questionTitle": "",
    "description": "",
    "sectionOrder": 3,
    "visualisations": ["single_value", "map"],
    "defaultVisualization": "single_value",
    "updatedAt": "2026-08-31T12:40:13.541Z",
    "createdAt": "2026-08-31T12:40:13.541Z",
    "data": { "counter": { "value": 193, "total": 4161 } }
  }
}
```

#### `GET /widgets/{indicator}/export`

Returns the indicator's data as a CSV file. It accepts the same `filters` and `breakdown`
parameters. See [CSV exports](#csv-exports) for the columns.

```bash
curl -g -OJ "https://visualisation.4growth-project.eu/api/widgets/type-of-stakeholder/export?filters[0][name]=sector&filters[0][operator]==&filters[0][values][0]=Agriculture"
```

### Projection endpoints

Projection endpoints are not paginated. Two filter parameters are used, and they do different
things:

- `dataFilters` selects which projection data is included: scenario, country, technology and so on.
- `filters` selects which items the endpoint lists.

#### `GET /projections/filters`

Returns the six projection filters as `{ name, label, values }`: `scenario`, `technology`,
`technology-type`, `country`, `unit` and `category`.

| Parameter | Description |
| :--- | :--- |
| `filters` | Optional. A `category` filter narrows the `technology` and `technology-type` values to that category. Other filter names have no effect here |

#### `GET /projections/widgets`

Returns the six projection indicators. Each has `id`, `type`, `title`, `description` (HTML),
`visualizations`, `defaultVisualization` and `data`.

| Parameter | Description |
| :--- | :--- |
| `filters` | Optional. Selects indicators by `type`, for example `type` = `revenues` |
| `dataFilters` | Optional. Selects the projection data that is aggregated into each indicator |

Without `dataFilters`, the values add up all scenarios, countries, technologies and both
categories, which is rarely what you want. Set at least a `scenario`.

Revenues in the baseline scenario for Belgium and France:

```bash
curl -g "https://visualisation.4growth-project.eu/api/projections/widgets?filters[0][name]=type&filters[0][operator]==&filters[0][values][0]=revenues&dataFilters[0][name]=scenario&dataFilters[0][operator]==&dataFilters[0][values][0]=baseline&dataFilters[1][name]=country&dataFilters[1][operator]=IN&dataFilters[1][values][0]=Belgium&dataFilters[1][values][1]=France"
```

```json
{
  "data": [
    {
      "id": 6,
      "type": "revenues",
      "title": "Revenues",
      "visualizations": ["line_chart", "bar_chart", "table"],
      "defaultVisualization": "bar_chart",
      "description": "<p>Revenue represents the total revenue generated from product sales or subscriptions. It is measured in euros (EUR).</p>",
      "data": {
        "EUR": [
          { "year": 2020, "value": 518910489.0448067 },
          { "year": 2021, "value": 574459679.9419433 }
        ]
      }
    }
  ]
}
```

The response is shortened here: `data.EUR` has 21 entries, one per year from 2020 to 2040.

#### `GET /projections/widgets/{id}/export`

Returns one projection indicator as a CSV file. `{id}` is the numeric id from the
[projection indicator list](#projection-indicators). It accepts `dataFilters`.

#### `GET /projections/custom-widget/settings`

Returns the options that `/projections/custom-widget` accepts: the visualisation types in
`availableVisualizations`, and for each type the allowed values of every setting as
`{ value, label }` pairs.

#### `GET /projections/custom-widget`

Returns one indicator split by a dimension you choose.

| Parameter | Description |
| :--- | :--- |
| `settings` | Required. One visualisation type with its settings, see below |
| `dataFilters` | Optional. Selects the projection data, as above |
| `breakdown` | Optional. A dimension to group the result by. Not available for `bubble_chart` |
| `othersAggregation` | Optional. `visible` (default) keeps the 9 largest groups and adds the rest up as `Others`. `hidden` keeps the 10 largest and drops the rest |

`settings` takes exactly one of these forms:

| Type | Settings |
| :--- | :--- |
| `line_chart` | `settings[line_chart][vertical]` = indicator, `settings[line_chart][color]` = dimension |
| `bar_chart` | `settings[bar_chart][vertical]` = indicator, `settings[bar_chart][color]` = dimension |
| `table` | `settings[table][vertical]` = indicator, `settings[table][color]` = dimension. Returns one row per year, scenario, technology, technology type, country and category |
| `bubble_chart` | `bubble` and `color` = dimensions; `vertical`, `horizontal` and `size` = indicators |

- **Indicators:** `addressable-market`, `penetration`, `shipments`, `installed-base`, `prices`,
  `revenues`.
- **Dimensions:** `type`, `scenario`, `technology`, `technology-type`, `country`, `unit`,
  `category`.

`bubble_chart` returns a single unit group, so indicators measured in another unit come back as 0.
Prefer `line_chart`, `bar_chart` or `table`.

Baseline revenues per technology, for Belgium and France:

```bash
curl -g "https://visualisation.4growth-project.eu/api/projections/custom-widget?settings[line_chart][vertical]=revenues&settings[line_chart][color]=technology&dataFilters[0][name]=scenario&dataFilters[0][operator]==&dataFilters[0][values][0]=baseline&dataFilters[1][name]=country&dataFilters[1][operator]=IN&dataFilters[1][values][0]=Belgium&dataFilters[1][values][1]=France"
```

```json
{
  "data": {
    "EUR": [
      { "year": 2020, "color": "Decision Support Systems", "vertical": 12821298.130813012 },
      { "year": 2020, "color": "Farm Management Information Systems", "vertical": 14983391.76444267 }
    ]
  }
}
```

#### `GET /projections/custom-widget/export`

Returns the custom projection as a CSV file. It takes the same parameters as
`/projections/custom-widget`.

## Filtering

### Syntax

A filter has a `name`, an `operator` and a list of `values`. Filters are sent in the query string
as an array, using bracket notation:

```
filters[0][name]=sector&filters[0][operator]==&filters[0][values][0]=Agriculture
```

Note the two equals signs after `[operator]`: the first belongs to the query string and the second
is the operator `=`. Add more filters with the next index (`filters[1]...`), and more values with
the next value index (`[values][1]`).

- Some HTTP clients need the brackets URL-encoded (`%5B` and `%5D`). With `curl`, use `-g`.
- Encode spaces and special characters in values, for example `United%20Kingdom`.
- Values are case-sensitive and must match exactly.

### How filters combine

- Several values in one filter are alternatives: `Belgium` or `France`.
- Several filters must all match: sector is `Agriculture` and country is `Belgium` or `France`.

Agriculture surveys from Belgium or France:

```bash
curl -g "https://visualisation.4growth-project.eu/api/widgets/total-surveys?filters[0][name]=sector&filters[0][operator]==&filters[0][values][0]=Agriculture&filters[1][name]=location-country-region&filters[1][operator]==&filters[1][values][0]=Belgium&filters[1][values][1]=France"
```

### Operators

| Endpoints | Operators |
| :--- | :--- |
| `/filters`, `/sections`, `/widgets/{indicator}` and its export | `=`, `!=` |
| `/projections/*` | `=`, `!=`, `IN`, `!IN` |

In projection filters, `=` with several values behaves like `IN`, and `!=` with several values
like `!IN`. In survey filters, use `!=` with a single value only.

### Survey filters

A survey filter keeps the surveys whose answer to a question matches. The filter `name` is the id
of that question, and the `values` are answers to it. Call `GET /filters` for the current list.
There are 36 filters:

| Group | Filter names |
| :--- | :--- |
| Data source | `data-source` |
| General | `sector`, `type-of-stakeholder`, `location-country-region`, `primary-area-of-operation-in-forestry`, `organisation-size`, `organisation-type`, `geographical-reach` |
| Adoption | `digital-technologies-integrated`, `technology-type-agriculture`, `technology-type-forestry`, `primary-functions`, `barriers` |
| Technology providers | `tech-provider-agri-forestry-percentage`, `tech-provider-sales-model`, `tech-provider-user-type`, `tech-provider-data-types` |
| Performance | `network-connectivity`, `network-connectivity-type`, `level-of-reliability`, `further-adoption-with-connectivity` |
| Costs | `tech-provider-cost-structure`, `tech-provider-market-research`, `tech-provider-market-penetration`, `tech-provider-aftersales`, `tech-provider-user-priorities` |
| Data management | `type-of-data-collected`, `data-payments`, `types-of-tools-or-platforms`, `operate-without-data` |
| Data storage | `data-storage`, `data-sharing`, `data-recipients` |
| Impact and outlook | `cost-savings-efficiency`, `sustainability`, `plans-to-expand-or-upgrade` |

Values of the most used filters, as of 16 November 2026:

| Filter | Values |
| :--- | :--- |
| `data-source` | `survey`, `automated` |
| `sector` | `Agriculture`, `Forestry`, `Both`, `N/A` |
| `location-country-region` | `Albania`, `Andorra`, `Austria`, `Belgium`, `Bulgaria`, `Croatia`, `Cyprus`, `Czechia`, `Denmark`, `Estonia`, `Finland`, `France`, `Germany`, `Greece`, `Hungary`, `Ireland`, `Italy`, `Latvia`, `Lithuania`, `Netherlands`, `Poland`, `Portugal`, `Romania`, `Slovakia`, `Slovenia`, `Spain`, `Sweden`, `United Kingdom` |
| Yes/no questions, such as `digital-technologies-integrated`, `barriers`, `data-sharing`, `sustainability` | `Yes`, `Not at all`, `Don't know`, `N/A` |

Three things to know:

- **Country** is filtered by its English name, as listed above, but map data returns ISO 3166-1
  alpha-3 codes (`BEL`). A name that is not in the list matches no surveys.
- **`data-source`** selects where the data came from, see
  [Survey data](#survey-data-1). Sending both values, `survey` and `automated`, also adds a
  per-source split to the response (`bySource`).
- **The map** of an indicator applies only the country and `data-source` filters. Other filters do
  not change map values.

### Projection filters

Use these names in `dataFilters`. Call `GET /projections/filters` for the current values.

| Name | Values |
| :--- | :--- |
| `scenario` | `baseline`, `reimagining_progress`, `the_fractured_continent`, `the_corporate_epoch` |
| `category` | `Agriculture`, `Forestry` |
| `technology` (Agriculture) | `Farm Management Information Systems`, `Guidance and Controlled Traffic Farming`, `Livestock wearables`, `Recording and Mapping Technologies`, `Robotics and Smart Machines`, `Variable Rate Technologies` |
| `technology` (Forestry) | `Decision Support Systems`, `Field Survey Technologies`, `Remote Sensing Technologies`, `Telematics Systems` |
| `technology-type` | `Hardware`, `Software`, `Service` (Service exists for Agriculture only) |
| `country` | The 27 EU member states, by English name (`Belgium`) or ISO 3166-1 alpha-3 code (`BEL`) |
| `unit` | `%`, `EUR`, `Units` |
| `type` | `addressable-market`, `penetration`, `shipments`, `installed-base`, `prices`, `revenues` |

Years cannot be filtered. Every response covers 2020 to 2040.

## Response formats

### JSON envelope

Every JSON response wraps its result in `data`. `GET /widgets` is the only paginated endpoint in
this guide and adds `metadata`:

```json
{
  "data": [ ... ],
  "metadata": { "totalItems": 39, "totalPages": 2, "size": 25, "page": 1 }
}
```

`metadata` is left out when pagination is disabled.

### Survey data

The `data` object of a survey indicator holds one or more of these keys, depending on the
indicator's visualisation types:

| Key | Shape | Present when |
| :--- | :--- | :--- |
| `counter` | `{ value, total }` | `total-surveys` and `total-countries` |
| `chart` | `[{ label, value, total }]` | The indicator has a bar, pie or area visualisation |
| `map` | `[{ country, value, count, total }]` | The indicator has the `map` visualisation |
| `breakdown` | `[{ label, data: [{ label, value, total }] }]` | `breakdown` was requested. It replaces the other keys |
| `bySource` | `[{ source, data: { chart } }]` | The `data-source` filter has both values |

A chart, with the filter `sector` = `Agriculture` (shortened):

```json
"data": {
  "chart": [
    { "label": "Advisory group", "value": 70, "total": 1188 },
    { "label": "Cooperative/Association", "value": 81, "total": 1188 },
    { "label": "Producer (Farmer/Forest Owner/Forester)", "value": 729, "total": 1188 }
  ]
}
```

A map (shortened). `value` is a percentage and is sent as a string; `count` and `total` are
numbers, or `null` for a country with no counted answers:

```json
"data": {
  "map": [
    { "country": "AUT", "value": "23.7623762376237624", "count": 24, "total": 101 },
    { "country": "BEL", "value": "46.1111111111111111", "count": 83, "total": 180 }
  ]
}
```

A breakdown, from `GET /widgets/sector?breakdown=type-of-stakeholder` (shortened). The outer
`label` is an answer to the breakdown indicator, and the inner list is the indicator's own chart
for that group:

```json
"data": {
  "breakdown": [
    {
      "label": "Advisory group",
      "data": [
        { "label": "Agriculture", "value": 70, "total": 88 },
        { "label": "Forestry", "value": 14, "total": 88 },
        { "label": "Both", "value": 4, "total": 88 }
      ]
    }
  ]
}
```

Both data sources, from `GET /widgets/sector` with `data-source` = `survey`, `automated`
(shortened). `chart` holds the combined figures and `bySource` the figures per source:

```json
"data": {
  "chart": [
    { "label": "Agriculture", "value": 1188, "total": 4161 },
    { "label": "Forestry", "value": 2821, "total": 4161 }
  ],
  "bySource": [
    { "source": "survey", "data": { "chart": [
      { "label": "Agriculture", "value": 1188, "total": 1723 },
      { "label": "Forestry", "value": 383, "total": 1723 }
    ] } },
    { "source": "automated", "data": { "chart": [
      { "label": "Forestry", "value": 2438, "total": 2438 }
    ] } }
  ]
}
```

### Projection data

Projection values are always grouped by unit (`EUR`, `Units` or `%`).

| Endpoint | Shape of `data` |
| :--- | :--- |
| `/projections/widgets` (each item's `data`) | `{ "<unit>": [{ year, value }] }` |
| `/projections/custom-widget`, `line_chart` or `bar_chart` | `{ "<unit>": [{ year, color, vertical }] }` |
| `/projections/custom-widget`, `table` | `{ "<unit>": [{ year, value, scenario, technology, technologyType, country, category }] }` |
| `/projections/custom-widget`, `bubble_chart` | `{ "<unit>": [{ year, bubble, color, vertical, horizontal, size }] }` |
| `/projections/custom-widget` with `breakdown` | `{ "<unit>": [{ label, data: [{ label, value, total }] }] }` |

- `color` and `bubble` hold a value of the chosen dimension, for example a technology name.
  `vertical`, `horizontal` and `size` hold the values of the chosen indicators.
- With `breakdown`, the outer `label` is a value of the breakdown dimension. In the inner list,
  `label` is the year as text, `value` is the group's figure and `total` is the figure for all
  groups that year.
- Dimension values are formatted for display: `reimagining_progress` is returned as
  `Reimagining Progress`. Countries are returned as ISO 3166-1 alpha-3 codes.
- A query that matches no data returns `{ "data": {} }`.

### CSV exports

Export endpoints return `Content-Type: text/csv; charset=utf-8` and a
`Content-Disposition: attachment` header with the file name. Files are comma-separated, have a
header row, and quote values that contain commas or quotes.

The file name is the indicator title in lower case with hyphens, plus the UTC date:
`type-of-stakeholder-2026-11-16.csv`. Custom projections are named
`custom-projection-2026-11-16.csv`.

| Export | Columns |
| :--- | :--- |
| Survey chart | `label,value,total` |
| Survey counter | `value,total` |
| Survey map | `country,value,count,total` |
| Survey breakdown | `breakdown_label,label,value,total` |
| Projection indicator | `unit,year,value` |
| Custom projection, line or bar | `unit,year,color,vertical` |
| Custom projection, table | `unit,year,value,scenario,technology,technology_type,country,category` |
| Custom projection, bubble | `unit,year,bubble,color,vertical,horizontal,size` |
| Custom projection with breakdown | `unit,breakdown_label,label,value,total` |

A survey export contains one dataset. With `breakdown` it is the breakdown; otherwise it follows
the indicator's `defaultVisualization`, so `adoption-of-technology-by-country` exports its map and
most others export their chart. The per-source split (`bySource`) is not exported.

```
label,value,total
Advisory group,70,1188
"Agriculture/Forest Operator (e.g., agriculture or forestry machine operator)",58,1188
Cooperative/Association,81,1188
```

```
unit,year,value
EUR,2020,518910489.0448067
EUR,2021,574459679.9419433
```

### Errors

Errors return a JSON body with an `errors` list. Each entry has the HTTP `status` as a string, a
`title` with the message, and `meta.timestamp`.

| Status | Meaning |
| :--- | :--- |
| 400 | A parameter is invalid, or the indicator has no data to export |
| 401 | The route needs a login. It is not one of the data endpoints |
| 404 | The indicator or projection id does not exist |
| 500 | Unexpected error |

An unknown indicator:

```json
{
  "errors": [
    {
      "status": "404",
      "title": "Widget with id does-not-exist not found",
      "meta": { "timestamp": "2026-11-16T12:38:58.613Z", "path": "/widgets/does-not-exist", "type": "Error" }
    }
  ]
}
```

An invalid parameter. `detail` is a JSON string whose `path` names the parameter:

```json
{
  "errors": [
    {
      "status": "400",
      "title": "Invalid enum value. Expected '=' | '!=', received 'LIKE'",
      "detail": "{\"received\":\"LIKE\",\"code\":\"invalid_enum_value\",\"options\":[\"=\",\"!=\"],\"path\":[\"filters\",0,\"operator\"],\"message\":\"Invalid enum value. Expected '=' | '!=', received 'LIKE'\"}",
      "meta": { "timestamp": "2026-11-16T12:38:59.462Z" }
    }
  ]
}
```

## What the data means

### Survey data

Survey data comes from two sources, selected with the `data-source` filter. Without that filter,
both are combined.

| Source | What it is | Size on 16 November 2026 |
| :--- | :--- | :--- |
| `survey` | Answers people gave to the 4Growth survey, collected in three waves between 2024 and 2026 through seven regional observatories | 1,723 surveys |
| `automated` | Data extracted from the websites of organisations, covering forestry only | 2,438 organisations in 24 countries |

Both sources are served in production. The `automated` data is real data, loaded in every
environment, and does not depend on any setting.

The API does not say which wave an answer belongs to, and waves cannot be filtered. See
[Survey waves](#survey-waves).

Each indicator is one survey question. Its `question` field holds the question text.

**Charts** (`chart`, and the inner lists of `breakdown`)

- `value` is the number of answers with that `label`. It is a count, not a percentage.
- `total` is the number of answers to the question across all labels, so `value / total` gives the
  share.
- `N/A` is a label of its own. It stands for surveys that did not answer the question, and it is
  included in `total`. Subtract it to get the number of actual responses.
- In questions that allow several answers, each selected option is counted. `total` then counts
  answers, not surveys.
- A breakdown keeps the 9 most frequent labels and adds the rest up as `Others`.

**Map** (`map`)

- `value` is the percentage of `Yes` answers in that country.
- `count` is the number of `Yes` answers and `total` is the number of counted answers. Counted
  answers are `Yes`, `No`, `Not at all` and `Don't know`; `N/A` is left out.
- `total` is therefore lower than the number of surveys from that country, and it differs between
  questions.

**Counters** (`counter`)

- For `total-surveys`, `value` is the number of surveys that match the filters. For
  `total-countries`, it is the number of countries they come from.
- `total` is the same figure without filters, apart from `data-source`.

The API applies no weighting, no rounding and no minimum number of responses. Small groups are
returned as they are, so check `total` before publishing a share. Figures can change as data
cleaning continues, and not every survey answers every question, so totals vary with the filters
applied.

#### How survey data is processed

The platform does not serve the raw survey export. Before the data is loaded, it goes through
these steps:

1. **Extract.** Answers are downloaded from the survey database kept by Wageningen University &
   Research (WUR). Only answers chosen from a list of options are downloaded. Free-text answers
   and personal data, such as names, emails and consent fields, are left out.
2. **Join.** Each answer is joined to its survey, its question text and its answer label. Answers
   that cannot be matched to all three are dropped.
3. **Clean.** Question texts are tidied, and answer labels are aligned so that the same answer
   reads the same way in every wave. For example, agreement scales are mapped to `Yes`,
   `Not at all` and `Don't know`, and `Other namely` becomes `Other`. Blank answers are dropped.
4. **Assign a country.** The country comes from the survey's location question. If that answer is
   missing, it is taken from the language of the survey. A survey whose country cannot be
   identified is dropped.
5. **Add `N/A`.** When a survey skipped a question that other surveys in the same group answered,
   it gets an `N/A` answer for it. The groups are waves 1 and 3, wave 2, and the automated data.
   Questions that nobody in a group answered get no `N/A` rows.
6. **Keep the mapped questions.** Each question is assigned to one or more indicators, and only
   those questions are loaded. The consent and contact questions and two other questions are left
   out. Repeated answers within a survey are removed.

The `automated` data goes through the same steps.

#### Survey waves

The survey was collected in three waves. They are loaded as two groups:

| Group | Surveys on 16 November 2026 |
| :--- | :--- |
| Waves 1 and 3 | 813 |
| Wave 2 | 910 |

Waves 1 and 3 arrive from WUR as one dataset in the same format, so they are processed and stored
together and cannot be told apart. Wave 2 was collected by WUR with a different methodology, so it arrives as a separate dataset in
a different format, with some questions and answers worded differently. It has its own processing
step, which converts it to the same questions and answer labels as the other waves.

Each answer is stored with its group, but the API does not use it. There is no wave filter
because the waves are aligned to be read as one dataset, and because waves 1 and 3 cannot be
separated.

### Projection data

Projections are yearly figures from 2020 to 2040 for digital technologies in agriculture and
forestry, for each of the 27 EU member states.

**Indicators**

| `type` | Meaning | Unit |
| :--- | :--- | :--- |
| `addressable-market` | The part of the market that can realistically be reached or served, given current accessibility, infrastructure and economic conditions | `Units` |
| `penetration` | How much of the addressable market has been reached: installed base / addressable market × 100 | `%` |
| `shipments` | Products purchased in a period. Hardware is counted in devices and software in subscriptions | `Units` |
| `installed-base` | Products currently in use: shipments added up over the product lifetime, less those that reached end of life | `Units` |
| `prices` | Average cost of the product | `EUR` |
| `revenues` | Revenue from product sales or subscriptions | `EUR` |

Each indicator's `description` field in `GET /projections/widgets` has the full text.

**Dimensions**

- `scenario`: the future the projection is modelled under. `baseline` projects the market from
  current inputs, assumptions and market conditions. The other three are Reimagining Progress, The
  Fractured Continent and The Corporate Epoch. The platform's projections pages describe each one.
- `category`: the sector, `Agriculture` or `Forestry`. The platform calls it "operation area".
- `technology` and `technology-type`: the technology and its component (hardware, software or
  service).
- `country`: an EU member state.

**How values are aggregated**

A response adds up every projection that matches `dataFilters`:

- `addressable-market`, `shipments`, `installed-base` and `revenues` are sums.
- `penetration` is recalculated from the sums: total installed base / total addressable market ×
  100.
- `prices` is recalculated the same way: total revenues / total shipments.

Sums across scenarios are not meaningful, so always filter by one `scenario`. Filter by `category`
too unless you want agriculture and forestry added together.

## Data updates

- **Survey data** is extracted from the survey database kept by Wageningen University & Research,
  the project coordinator. **Projection data** is loaded from the project's market model files
  (deliverable D3.4).
- Survey data is refreshed every week. A scheduled process runs every Sunday at 03:00, extracts
  the answers from WUR again, processes them and loads the result.
- Projection data is not part of the weekly process. It changes only when new model files are
  released with a new version of the platform, and was last updated on 25 August 2026.
- The API always serves the current data. It has no dataset version number, no "last updated"
  date and no access to earlier versions. The `createdAt` and `updatedAt` fields describe the
  indicator's record, not the survey data.
- To know which version you hold, save the response or the CSV export together with the date you
  fetched it. The export file name already carries that date. To detect a change, compare
  `GET /widgets/total-surveys` or a stored copy of `GET /sections` with a new one.

## Survey indicators

The 39 indicators by section. Use the id in `GET /widgets/{indicator}`.

| Section (`slug`) | Indicator id | Title |
| :--- | :--- | :--- |
| 1. `overview` | `adoption-of-technology-by-country` | Adoption of technology by country |
| | `total-countries` | Total number of countries |
| | `total-surveys` | Total number of surveys |
| | `sector` | Sector |
| 2. `general-information` | `type-of-stakeholder` | Type of stakeholder |
| | `location-country-region` | Location |
| | `primary-area-of-operation-in-forestry` | Primary Area of Operation in forestry |
| | `primary-area-of-operation-in-agriculture` | Primary Area of Operation in agriculture |
| | `organisation-size` | Organisation size |
| | `organisation-type` | Type of organisation |
| | `geographical-reach` | Geographical reach of services |
| 3. `adoption-of-digital-technologies` | `digital-technologies-integrated` | Integration of digital technologies |
| | `technology-type-agriculture` | Type of digital technology used for agriculture |
| | `technology-type-forestry` | Type of digital technology used for forestry |
| | `primary-functions` | Primary functions of technologies in the value chain |
| | `barriers` | Barriers hindering further integration |
| 4. `technology-providers` | `tech-provider-agri-forestry-percentage` | Products/services targeted at agriculture and forestry |
| | `tech-provider-sales-model` | Sales model |
| | `tech-provider-user-type` | Primary user types |
| | `tech-provider-data-types` | Data types generated or relied upon |
| 5. `technology-performance` | `network-connectivity` | Network connectivity |
| | `network-connectivity-type` | Type of network connectivity |
| | `level-of-reliability` | Network reliability |
| | `further-adoption-with-connectivity` | Further adoption with better connectivity |
| 6. `associated-costs-prerequisites` | `tech-provider-cost-structure` | Cost structure for technology implementation |
| | `tech-provider-market-research` | Market research before development |
| | `tech-provider-market-penetration` | Market penetration strategies |
| | `tech-provider-aftersales` | After-sales service and support |
| | `tech-provider-user-priorities` | User needs prioritization in development |
| 7. `data-management-and-sharing` | `type-of-data-collected` | Type of data collected |
| | `data-payments` | Payment for data |
| | `types-of-tools-or-platforms` | Tools or platforms for data collection |
| | `operate-without-data` | Ability to operate without data |
| 8. `data-storage-and-flows` | `data-storage` | Data storage methods |
| | `data-sharing` | Data sharing practices |
| | `data-recipients` | Data recipients |
| 9. `economic-benefits-and-impact` | `cost-savings-efficiency` | Cost savings or increased efficiency |
| 10. `environmental-and-sustainability-impact` | `sustainability` | Sustainability and environmental practices |
| 11. `future-outlook` | `plans-to-expand-or-upgrade` | Plans to expand or upgrade digital infrastructure |

Only `adoption-of-technology-by-country` and `total-surveys` list the `map` visualisation, and only
the first returns map data.

## Projection indicators

Use the id in `GET /projections/widgets/{id}/export`.

| `id` | `type` | Title | Unit |
| :--- | :--- | :--- | :--- |
| 1 | `addressable-market` | Addressable Market | `Units` |
| 2 | `penetration` | Penetration | `%` |
| 3 | `shipments` | Shipments | `Units` |
| 4 | `installed-base` | Installed Base | `Units` |
| 5 | `prices` | Prices | `EUR` |
| 6 | `revenues` | Revenues | `EUR` |
