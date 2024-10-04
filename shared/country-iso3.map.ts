const COUNTRY_NAMES_ISO3 = [
  { name: 'Albania', iso3: 'ALB' },
  { name: 'Andorra', iso3: 'AND' },
  { name: 'Austria', iso3: 'AUT' },
  { name: 'Belarus', iso3: 'BLR' },
  { name: 'Belgium', iso3: 'BEL' },
  { name: 'Bosnia and Herzegovina', iso3: 'BIH' },
  { name: 'Bulgaria', iso3: 'BGR' },
  { name: 'Croatia', iso3: 'HRV' },
  { name: 'Czechia', iso3: 'CZE' },
  { name: 'Denmark', iso3: 'DNK' },
  { name: 'Estonia', iso3: 'EST' },
  { name: 'Faroe Islands', iso3: 'FRO' },
  { name: 'Finland', iso3: 'FIN' },
  { name: 'France', iso3: 'FRA' },
  { name: 'Germany', iso3: 'DEU' },
  { name: 'Gibraltar', iso3: 'GIB' },
  { name: 'Greece', iso3: 'GRC' },
  { name: 'Guernsey', iso3: 'GGY' },
  { name: 'Holy See', iso3: 'VAT' },
  { name: 'Hungary', iso3: 'HUN' },
  { name: 'Iceland', iso3: 'ISL' },
  { name: 'Ireland', iso3: 'IRL' },
  { name: 'Isle of Man', iso3: 'IMN' },
  { name: 'Italy', iso3: 'ITA' },
  { name: 'Jersey', iso3: 'JEY' },
  { name: 'Latvia', iso3: 'LVA' },
  { name: 'Liechtenstein', iso3: 'LIE' },
  { name: 'Lithuania', iso3: 'LTU' },
  { name: 'Luxembourg', iso3: 'LUX' },
  { name: 'Malta', iso3: 'MLT' },
  { name: 'Moldova', iso3: 'MDA' },
  { name: 'Monaco', iso3: 'MCO' },
  { name: 'Montenegro', iso3: 'MNE' },
  { name: 'Netherlands', iso3: 'NLD' },
  { name: 'Norway', iso3: 'NOR' },
  { name: 'Poland', iso3: 'POL' },
  { name: 'Portugal', iso3: 'PRT' },
  { name: 'Republic of North Macedonia', iso3: 'MKD' },
  { name: 'Romania', iso3: 'ROU' },
  { name: 'Russian Federation', iso3: 'RUS' },
  { name: 'San Marino', iso3: 'SMR' },
  { name: 'Serbia', iso3: 'SRB' },
  { name: 'Slovakia', iso3: 'SVK' },
  { name: 'Slovenia', iso3: 'SVN' },
  { name: 'Spain', iso3: 'ESP' },
  { name: 'Svalbard and Jan Mayen', iso3: 'SJM' },
  { name: 'Sweden', iso3: 'SWE' },
  { name: 'Switzerland', iso3: 'CHE' },
  { name: 'Ukraine', iso3: 'UKR' },
  { name: 'United Kingdom', iso3: 'GBR' },
  { name: 'Åland Islands', iso3: 'ALA' },
] as const;

const getISO3ByCountryName = (countryName: string): string | undefined => {
  return COUNTRY_NAMES_ISO3.find((r) => r.name === countryName)?.iso3;
};

const getCountryNameByISO3 = (iso3: string): string | undefined => {
  return COUNTRY_NAMES_ISO3.find((r) => r.iso3 === iso3)?.name;
};

export const CountryISO3Map = {
  getISO3ByCountryName,
  getCountryNameByISO3,
} as const;
