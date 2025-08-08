const COUNTRY_NAMES_ISO = [
  { name: 'Albania', language: 'AL', iso3: 'ALB' },
  { name: 'Andorra', language: 'AD', iso3: 'AND' },
  { name: 'Austria', language: 'AT', iso3: 'AUT' },
  { name: 'Belarus', language: 'BY', iso3: 'BLR' },
  { name: 'Belgium', language: 'BE', iso3: 'BEL' },
  { name: 'Bosnia and Herzegovina', language: 'BA', iso3: 'BIH' },
  { name: 'Bulgaria', language: 'BG', iso3: 'BGR' },
  { name: 'Croatia', language: 'HR', iso3: 'HRV' },
  { name: 'Czechia', language: 'CZ', iso3: 'CZE' },
  { name: 'Denmark', language: 'DK', iso3: 'DNK' },
  { name: 'Estonia', language: 'EE', iso3: 'EST' },
  { name: 'Faroe Islands', language: 'FO', iso3: 'FRO' },
  { name: 'Finland', language: 'FI', iso3: 'FIN' },
  { name: 'France', language: 'FR', iso3: 'FRA' },
  { name: 'Germany', language: 'DE', iso3: 'DEU' },
  { name: 'Gibraltar', language: 'GI', iso3: 'GIB' },
  { name: 'Greece', language: 'EL', iso3: 'GRC' },
  { name: 'Guernsey', language: 'GG', iso3: 'GGY' },
  { name: 'Holy See', language: 'VA', iso3: 'VAT' },
  { name: 'Hungary', language: 'HU', iso3: 'HUN' },
  { name: 'Iceland', language: 'IS', iso3: 'ISL' },
  { name: 'Ireland', language: 'IE', iso3: 'IRL' },
  { name: 'Isle of Man', language: 'IM', iso3: 'IMN' },
  { name: 'Italy', language: 'IT', iso3: 'ITA' },
  { name: 'Jersey', language: 'JE', iso3: 'JEY' },
  { name: 'Latvia', language: 'LV', iso3: 'LVA' },
  { name: 'Liechtenstein', language: 'LI', iso3: 'LIE' },
  { name: 'Lithuania', language: 'LT', iso3: 'LTU' },
  { name: 'Luxembourg', language: 'LU', iso3: 'LUX' },
  { name: 'Malta', language: 'MT', iso3: 'MLT' },
  { name: 'Moldova', language: 'MD', iso3: 'MDA' },
  { name: 'Monaco', language: 'MC', iso3: 'MCO' },
  { name: 'Montenegro', language: 'ME', iso3: 'MNE' },
  { name: 'Netherlands', language: 'NL', iso3: 'NLD' },
  { name: 'Norway', language: 'NO', iso3: 'NOR' },
  { name: 'Poland', language: 'PL', iso3: 'POL' },
  { name: 'Portugal', language: 'PT', iso3: 'PRT' },
  { name: 'Republic of North Macedonia', language: 'MK', iso3: 'MKD' },
  { name: 'Romania', language: 'RO', iso3: 'ROU' },
  { name: 'Russian Federation', language: 'RU', iso3: 'RUS' },
  { name: 'San Marino', language: 'SM', iso3: 'SMR' },
  { name: 'Serbia', language: 'RS', iso3: 'SRB' },
  { name: 'Slovakia', language: 'SK', iso3: 'SVK' },
  { name: 'Slovenia', language: 'SI', iso3: 'SVN' },
  { name: 'Spain', language: 'ES', iso3: 'ESP' },
  { name: 'Svalbard and Jan Mayen', language: 'SJ', iso3: 'SJM' },
  { name: 'Sweden', language: 'SE', iso3: 'SWE' },
  { name: 'Switzerland', language: 'CH', iso3: 'CHE' },
  { name: 'Ukraine', language: 'UA', iso3: 'UKR' },
  { name: 'United Kingdom', language: 'EN', iso3: 'GBR' },
  { name: 'Åland Islands', language: 'AX', iso3: 'ALA' },
] as const;

const getISO3ByCountryName = (countryName: string): string | undefined => {
  return COUNTRY_NAMES_ISO.find((r) => r.name === countryName)?.iso3;
};

const getCountryNameByISO3 = (iso3: string): string | undefined => {
  return COUNTRY_NAMES_ISO.find((r) => r.iso3 === iso3)?.name;
};

const getCountryByNamelanguage = (language: string): string | undefined => {
  return COUNTRY_NAMES_ISO.find((r) => r.language === language)?.name;
};

export const CountryISOMap = {
  getISO3ByCountryName,
  getCountryNameByISO3,
  getCountryByNamelanguage,
} as const;
