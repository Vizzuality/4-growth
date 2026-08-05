import * as fs from 'fs/promises';
import * as path from 'path';
import { Logger } from '@nestjs/common';
import { getLevel3Text } from './wave2-qualtrics-mapping';

const FACT_ENTITIES = [
  'General_Information_4GROWTH',
  'Adoption_of_Digital_Technologies_and_Technology_Integration_4GROWTH',
  'Adoption_of_digital_technologies_and_technology_integration_for_tech_providers_',
  'Data_management_and_data_sharing_practices_4GROWTH',
  'Data_storage_and_data_flows_4GROWTH',
  'Technology_Performance_4GROWTH',
  'Economic_benefits_and_impact_4GROWTH',
  'Environmental_and_sustainability_impact_4GROWTH',
  'Future_outlook_4GROWTH',
  'Associated_costs_and_prerequisites',
  'Additional_comments_4GROWTH',
];

const DIMENSION_ENTITIES = [
  'European_countries',
  'Type_of_stakeholder',
  'Sector_',
  'AgricultureForestry_organisation_size_4GROWTH',
  'Area_Operation_forestry_4GROWTH',
  'Area_Operation_agriculture_4GROWTH',
  'Type_of_digital_technology_for_agriculture',
  'Type_of_digital_technology_for_forestry_',
  'Functions_Technologies_4GROWTH',
  'Network_connectivity',
  'Level_of_digitalisation_4GROWHT',
  'Data_collect_4GROWTH',
  'Platforms_collect_data_4GROWTH',
  'Data_stored_4GROWTH',
  'Data_recipients',
  'YesNo',
  'YesNoDontknow',
  'Agreement_scale_5_point',
  'Geographical_reach',
  'Agricultural_organisation_type',
  'Percentages_of_products_and_services',
  'Sales_models',
  'Types_of_users_for_technology',
  'Types_of_data',
  'After_sales_support',
];

// Hardcoded RootID → language mapping (OData survey metadata service unavailable per David's script)
const LANG_MAP: Record<string, number[]> = {
  EL: [
    2054, 1545, 1549, 1551, 2066, 531, 1564, 1571, 550, 2092, 2096, 2107,
    2108, 1597, 1602, 1603, 2119, 2120, 1609, 2129, 1623, 1631, 1638, 1643,
    2157, 1646, 1656, 1657, 1658, 1662, 1663, 1159, 1677, 1167, 1170, 1182,
    1185, 1189, 677, 1704, 1193, 1705, 1707, 1196, 1708, 1199, 1212, 1214,
    1217, 1220, 1736, 1231, 1232, 1237, 1755, 1756, 1249, 1766, 1768, 1773,
    1265, 1780, 1788, 1279, 1283, 1288, 1801, 1803, 1807, 1808, 1813, 1310,
    1826, 1320, 1834, 1845, 1336, 1854, 1855, 1860, 1354, 1356, 1868, 1872,
    1363, 1879, 1882, 1375, 1376, 1887, 1383, 1385, 1388, 1395, 1399, 1401,
    1915, 1916, 1920, 1413, 1415, 1417, 1939, 1428, 1429, 1950, 1955, 1956,
    1450, 1965, 434, 1461, 1467, 1991, 1995, 2004, 1505, 1506, 1509, 2029,
    1519, 2033, 2040, 2041, 2044, 1535,
  ],
  EN: [
    2049, 1794, 1158, 1162, 1809, 1556, 1942, 1431, 1432, 1559, 1306, 1307,
    1435, 1312, 1186, 1827, 1444, 2086, 1575, 1576, 1960, 1839, 1328, 1329,
    1970, 1205, 1206, 1333, 1846, 1593, 1210, 1721, 1848, 1469, 1850, 2104,
    1857, 1348, 1352, 1355, 1867, 1229, 75, 204, 1360, 1997, 2101, 1364,
    1878, 2134, 1368, 1370, 92, 2141, 1888, 2017, 248, 1379, 1508, 1763,
    2022, 2154, 1517, 1518, 1263, 2158, 1400, 1529, 1531, 1534,
  ],
  'ES-ES': [
    1539, 1540, 1552, 1555, 2073, 1562, 2076, 2078, 1569, 1573, 2090, 1582,
    2098, 2106, 1598, 1601, 2114, 1614, 1619, 1622, 2136, 2140, 2144, 1641,
    1642, 2153, 2155, 1645, 109, 1648, 1651, 1652, 1653, 1655, 1660, 1661,
    1664, 1665, 1668, 1669, 1671, 1161, 1673, 1163, 1674, 1675, 1166, 1678,
    1679, 1680, 1681, 1683, 1684, 1175, 1687, 1688, 1689, 1692, 1694, 1701,
    1709, 1202, 1207, 1209, 1211, 1724, 1723, 1222, 1230, 1751, 1752, 1753,
    1244, 1246, 1761, 1253, 1257, 1258, 1777, 1782, 1271, 1789, 1797, 1294,
    1304, 1305, 1823, 1837, 1840, 1334, 1346, 1347, 1350, 1877, 1880, 1885,
    1377, 1892, 1906, 1397, 1909, 1912, 1917, 1918, 1923, 1414, 1930, 1421,
    1936, 1937, 1944, 1952, 1442, 1959, 1451, 1453, 1468, 1483, 2010, 1514,
    1522, 2037, 1526, 2039, 1528, 1533,
  ],
  FI: [
    2048, 2052, 1544, 1548, 2064, 1554, 2068, 2069, 1558, 2070, 2071, 2072,
    2077, 1567, 2083, 1577, 2089, 1579, 43, 2093, 1585, 1586, 2097, 1588,
    1589, 1591, 2110, 2111, 2112, 2113, 1604, 1605, 1606, 1607, 2123, 1612,
    1613, 2125, 2127, 2131, 1620, 600, 2137, 1628, 1630, 2142, 1633, 2145,
    1635, 1636, 2148, 2149, 2150, 1640, 1644, 2156, 1647, 2163, 1654, 1154,
    1666, 1685, 1174, 1180, 1695, 674, 1187, 1188, 1195, 1710, 1711, 1714,
    1716, 1717, 1718, 1728, 1729, 1226, 1738, 1742, 1746, 1235, 1236, 1747,
    727, 1240, 1754, 1245, 1757, 1248, 1760, 1765, 1254, 1771, 1262, 1775,
    1776, 1781, 1272, 1273, 1274, 1275, 1784, 1785, 1787, 254, 1795, 1799,
    1800, 1291, 1804, 1293, 1295, 1298, 1810, 1812, 1302, 1816, 1309, 1821,
    1825, 1315, 1828, 1829, 1830, 1831, 1832, 1833, 1324, 1836, 1838, 1327,
    1841, 1842, 1843, 1844, 1847, 1851, 1853, 1342, 1858, 1859, 834, 1353,
    1358, 1871, 1881, 1884, 1886, 1380, 1382, 1894, 1384, 1896, 1897, 1898,
    1900, 1901, 1393, 1396, 1398, 1913, 1402, 1406, 1919, 1409, 1410, 1411,
    1927, 1418, 1935, 1425, 1938, 1945, 1434, 1948, 1437, 1439, 1953, 1445,
    1957, 1958, 1961, 1962, 1964, 1454, 1456, 1976, 1978, 1471, 1472, 1990,
    1481, 1993, 1996, 1486, 1488, 2001, 1491, 1494, 2011, 2012, 1501, 1503,
    2018, 2019, 2024, 2026, 1515, 2028, 1521, 2036, 1525, 2043, 2047,
  ],
  FR: [
    1280, 1924, 2055, 1416, 1292, 1676, 1168, 1297, 272, 1811, 1178, 1308,
    1181, 1532, 1318, 1703, 1706, 1452, 1325, 1200, 1330, 1459, 1462, 2103,
    2105, 1594, 1722, 1473, 1474, 1861, 1478, 1224, 1864, 1994, 1492, 1624,
    2008, 1627, 1634, 2020, 1895, 1269, 1404,
  ],
  HU: [1616, 1427, 1446],
  LT: [
    1538, 2050, 2051, 1541, 1542, 1543, 2057, 1546, 2058, 2059, 2061, 1550,
    2065, 2067, 1557, 1560, 1561, 1568, 1572, 1574, 1578, 2095, 1587, 2102,
    1592, 2109, 1599, 2115, 1608, 2121, 1610, 1611, 2126, 1617, 2133, 1626,
    2147, 1639, 2151, 2152, 2160, 1649, 2161, 1155, 1169, 1682, 1686, 1183,
    1697, 1700, 1702, 1197, 1198, 1713, 1204, 1719, 1208, 1726, 1215, 1216,
    1727, 1219, 1221, 1734, 1735, 1227, 1228, 1740, 1743, 1744, 1748, 1243,
    1758, 1250, 1251, 1252, 1762, 1764, 1767, 1769, 1770, 1259, 1267, 1791,
    1792, 1793, 1284, 1285, 1286, 1796, 1798, 1289, 1290, 1296, 1299, 1300,
    1301, 1814, 1303, 1815, 1817, 1819, 1314, 1319, 1321, 1322, 1331, 1849,
    1338, 1339, 1341, 1856, 321, 1349, 1862, 1351, 1357, 1359, 1873, 1362,
    1875, 1876, 1365, 1366, 1369, 1883, 1373, 1889, 1891, 1386, 1387, 1899,
    1390, 1391, 1392, 1902, 1394, 1903, 1908, 1910, 1911, 1403, 1407, 1921,
    1922, 1412, 1925, 1928, 1929, 1420, 1932, 1422, 1423, 1934, 1940, 1433,
    1946, 1947, 1949, 1438, 1443, 1447, 1449, 1966, 1455, 1968, 1458, 1460,
    1972, 1974, 1463, 1465, 1466, 1979, 1980, 1981, 1983, 1987, 1988, 1482,
    1485, 1487, 1999, 1490, 2002, 1493, 2006, 2007, 1496, 1497, 1500, 1502,
    1504, 2016, 1510, 1511, 1513, 2027, 1516, 2030, 2034, 2035, 1530, 2045,
    2046,
  ],
  NL: [
    1160, 1164, 1165, 1424, 1173, 1943, 1176, 1440, 2081, 1316, 1337, 1982,
    836, 1733, 2128, 1750, 2009, 2139, 1378, 1260, 2162, 1783, 761,
  ],
  PL: [
    1536, 1537, 2053, 2056, 1547, 2060, 2062, 2063, 1553, 2074, 1563, 2075,
    1565, 1566, 2079, 2080, 1570, 2082, 2084, 2085, 2087, 2088, 2091, 1580,
    1581, 2094, 1583, 1584, 2099, 2100, 1590, 1595, 1596, 1600, 2116, 2117,
    2118, 2122, 2124, 1615, 1618, 2130, 2132, 1621, 2135, 1625, 2138, 1629,
    2143, 1632, 2146, 1637, 2159, 1650, 1659, 1667, 1156, 1157, 1670, 1672,
    1171, 1172, 1177, 1690, 1179, 1691, 1693, 1184, 1696, 1698, 1699, 1190,
    1191, 1192, 1194, 1712, 1201, 1203, 1715, 1720, 1213, 1725, 1218, 1730,
    1731, 1732, 1223, 1225, 1737, 1739, 1741, 1233, 1234, 1745, 1749, 1238,
    1239, 1241, 1242, 1247, 1759, 1255, 1256, 1772, 1261, 1774, 1264, 1266,
    1778, 1268, 1779, 1270, 759, 1786, 1276, 1277, 1278, 1790, 1281, 1282,
    1287, 1802, 1805, 1806, 1818, 1820, 1822, 1311, 1824, 1313, 1317, 1323,
    1835, 1326, 1332, 1335, 1340, 1852, 1343, 1344, 1345, 1863, 1865, 1866,
    1869, 1870, 1361, 1874, 1367, 1371, 1372, 1374, 1890, 1381, 1893, 1389,
    1904, 1905, 1907, 1914, 1405, 1408, 386, 1926, 1931, 1419, 1933, 1426,
    1941, 1430, 1436, 1951, 1441, 1954, 1448, 1963, 1967, 1969, 1457, 1971,
    1973, 1975, 1464, 1977, 1470, 1984, 1985, 1986, 1475, 1476, 1477, 1989,
    1479, 1480, 1992, 1484, 1998, 2000, 1489, 2003, 2005, 1495, 1498, 1499,
    2013, 2014, 2015, 1507, 2021, 2023, 1512, 2025, 2031, 1520, 2032, 1523,
    1524, 2038, 1527, 2042,
  ],
};

const ID_COLUMNS = new Set(['ID', 'CalendarID', 'RootID']);

type AnswerType = 'categorical_answer' | 'open_answer';

interface MeltedRow {
  rowId: string;
  calendarId: number;
  rootId: number;
  surveyChapter: string;
  variable: string;
  value: number | string;
  answerType: AnswerType;
}

interface ResolvedRow extends MeltedRow {
  name: string | null;
  description: string | null;
}

function buildLangLookup(langMap: Record<string, number[]>): Map<number, string> {
  const lookup = new Map<number, string>();
  for (const [lang, ids] of Object.entries(langMap)) {
    for (const id of ids) {
      lookup.set(id, lang);
    }
  }
  return lookup;
}

function getAnswerType(value: unknown): AnswerType {
  if (typeof value === 'number' || typeof value === 'boolean') return 'categorical_answer';
  return 'open_answer';
}

function meltFactTable(rows: Record<string, unknown>[], chapter: string): MeltedRow[] {
  const result: MeltedRow[] = [];
  for (const row of rows) {
    const rowId = String(row['ID'] ?? '');
    const calendarId = Number(row['CalendarID'] ?? 0);
    const rootId = Number(row['RootID'] ?? 0);

    for (const [col, value] of Object.entries(row)) {
      if (ID_COLUMNS.has(col) || value === null || value === undefined) continue;
      result.push({
        rowId,
        calendarId,
        rootId,
        surveyChapter: chapter,
        variable: col,
        value: typeof value === 'boolean' ? (value ? 1 : 0) : (value as number | string),
        answerType: getAnswerType(value),
      });
    }
  }
  return result;
}

async function tryReadJson(filePath: string): Promise<Record<string, unknown>[] | null> {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

export async function wrangleWave2(
  inputDir = `${__dirname}/wave2`,
  outputDir = `${__dirname}/wave2`,
): Promise<void> {
  const logger = new Logger('ETL-Wave2-Wrangle');
  logger.log('Starting Wave 2 wrangling...');

  // 1. Melt Fact tables from wide format to long format
  const allMelted: MeltedRow[] = [];
  for (const entity of FACT_ENTITIES) {
    const rows = await tryReadJson(path.join(inputDir, `${entity}.json`));
    if (!rows) {
      logger.warn(`Fact entity not found, skipping: ${entity}`);
      continue;
    }
    const chapter = entity.replace(/_/g, ' ');
    const melted = meltFactTable(rows, chapter);
    allMelted.push(...melted);
    logger.log(`Melted ${melted.length} rows from ${entity}`);
  }

  // 2. Deduplicate on (rootId, variable, value) — mirrors Python drop_duplicates
  const seen = new Set<string>();
  const deduped = allMelted.filter((row) => {
    const key = `${row.rootId}:${row.variable}:${row.value}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // 3. Build dimension lookup: numeric ID → {Name, Description}
  const dimensionLookup = new Map<number, { Name: string; Description: string }>();
  for (const entity of DIMENSION_ENTITIES) {
    const rows = await tryReadJson(path.join(inputDir, `${entity}.json`));
    if (!rows) continue;
    for (const row of rows) {
      const id = row['ID'];
      if (id == null) continue;
      dimensionLookup.set(Number(id), {
        Name: String(row['Name'] ?? ''),
        Description: String(row['Description'] ?? row['Name'] ?? ''),
      });
    }
  }
  logger.log(`Loaded ${dimensionLookup.size} dimension entries`);

  // 4. Resolve categorical answer IDs against dimension lookup
  const resolved: ResolvedRow[] = deduped.map((row) => {
    if (row.answerType === 'categorical_answer') {
      const dim = dimensionLookup.get(Number(row.value));
      return { ...row, name: dim?.Name ?? null, description: dim?.Description ?? null };
    }
    return { ...row, name: null, description: null };
  });

  // 5. Assign stable numeric IDs to each unique variable (starting at 1000)
  const questionMapping = new Map<string, { chapter: string; id: number }>();
  let nextId = 1000;
  for (const row of resolved) {
    if (!questionMapping.has(row.variable)) {
      questionMapping.set(row.variable, { chapter: row.surveyChapter, id: nextId++ });
    }
  }

  // 6. Build Question_hierarchy.json
  const questionHierarchyList = Array.from(questionMapping.entries()).map(
    ([variable, { chapter, id }]) => {
      const level2 = variable.replace(/_/g, ' ');
      return {
        Level1: chapter,
        Level2: level2,
        Level3: getLevel3Text(level2),
        Level4: '',
        ID: id,
      };
    },
  );

  // 7. Build Categorical_Answers.json
  const catAnswerEntries = new Map<number, { Name: string; Description: string }>();
  for (const row of resolved) {
    if (row.answerType === 'categorical_answer') {
      const id = Number(row.value);
      if (!catAnswerEntries.has(id)) {
        catAnswerEntries.set(id, {
          Name: row.name ?? 'Unknown',
          Description: row.description ?? row.name ?? '',
        });
      }
    }
  }
  const categoricalAnswersList = [
    { Name: 'Unknown', ID: -1, Description: 'Unknown' },
    ...Array.from(catAnswerEntries.entries()).map(([id, { Name, Description }]) => ({
      ID: id,
      Name,
      Description,
    })),
  ];

  // 8. Build Answer.json
  const variableToId = new Map(
    Array.from(questionMapping.entries()).map(([v, { id }]) => [v, id]),
  );
  const answersList = resolved.map((row) => {
    const base = {
      CalendarID: row.calendarId,
      Survey_per_dayID: row.rootId,
      ID: row.rowId,
      Subquestion: variableToId.get(row.variable),
    };
    if (row.answerType === 'categorical_answer') {
      return { ...base, Categorical_Answer: Number(row.value) };
    }
    return { ...base, Open_ended_answer: String(row.value), Categorical_Answer: -1 };
  });

  // 9. Build Survey_metadata.json — one entry per unique RootID
  const langLookup = buildLangLookup(LANG_MAP);
  const surveyMetaMap = new Map<number, { calendarId: number; rowId: string }>();
  for (const row of resolved) {
    if (!surveyMetaMap.has(row.rootId)) {
      surveyMetaMap.set(row.rootId, { calendarId: row.calendarId, rowId: row.rowId });
    }
  }
  const surveyMetadataList = Array.from(surveyMetaMap.entries()).map(
    ([rootId, { calendarId, rowId }]) => ({
      CalendarID: calendarId,
      Survey_per_dayID: rootId,
      ID: rowId,
      Finished: 'True',
      Survey_language: langLookup.get(rootId) ?? 'EN',
      Duration: 100,
      Survey_record_ID: `mocked_${rootId}`,
    }),
  );

  // 10. Write 4 output JSON files in OData envelope format (expected by transform.ts)
  const saveODataJson = (filename: string, data: unknown[]) => {
    const payload = {
      '@odata.context': `https://mocked.odata/$metadata#${filename.replace('.json', '')}`,
      value: data,
    };
    return fs.writeFile(
      path.join(outputDir, filename),
      JSON.stringify(payload, null, 2),
      'utf-8',
    );
  };

  await Promise.all([
    saveODataJson('Question_hierarchy.json', questionHierarchyList),
    saveODataJson('Categorical_Answers.json', categoricalAnswersList),
    saveODataJson('Answer.json', answersList),
    saveODataJson('Survey_metadata.json', surveyMetadataList),
  ]);

  logger.log(
    `Wrangling complete: ${surveyMetadataList.length} surveys, ${answersList.length} answers`,
  );
}

if (require.main === module) {
  void wrangleWave2();
}
