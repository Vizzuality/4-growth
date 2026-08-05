/**
 * Ported from David's Python script (20260729 cleaned transform wave 2 data for vizzuality.py).
 * Maps OData short column codes (e.g. ADTTIntegrated) to full question text.
 * Used during the wrangling step to populate Question_hierarchy.json (Level3 field).
 *
 * Note: DSDFSending is corrected to "To whom" (Python script has "To who").
 */
export const QUALTRICS_MAPPING: Record<string, string> = {
  StartDate: 'Start Date',
  EndDate: 'End Date',
  Status: 'Response Type',
  IPAddress: 'IP Address',
  Progress: 'Progress',
  'Duration (in seconds)': 'Duration (in seconds)',
  Finished: 'Finished',
  RecordedDate: 'Recorded Date',
  ResponseId: 'Response ID',
  RecipientLastName: 'Recipient Last Name',
  RecipientFirstName: 'Recipient First Name',
  RecipientEmail: 'Recipient Email',
  ExternalReference: 'External Data Reference',
  LocationLatitude: 'Location Latitude',
  LocationLongitude: 'Location Longitude',
  DistributionChannel: 'Distribution Channel',
  UserLanguage: 'User Language',
  CFConfirm:
    'If you agree, please confirm the following statements: I have read the information presented in this consent form. I have had the opportunity to ask any questions related to this research and received satisfactory answers to my questions. I understand that relevant sections of the data collected during the research may be accessed by individuals from the 4Growth project. With full knowledge of all the foregoing, I agree that my answers will be processed as part of the 4Growth project. I understand that relevant sections of the data collected during the research may be looked at by individuals from the 4Growth project. I give permission for these individuals to have access to my responses.',
  CFContact:
    'I agree to be contacted again by the researchers for clarification or elaboration on my input in the discussion (Optional)',
  CFContactYes: 'Please provide your email address:',
  CFName: 'Name:',
  GIName: 'Organisation Name:',
  GISector: 'Sector (Agri/Forestry/Both):',
  GIType: 'Type of stakeholder:',
  GILocation: 'Location (Country/Region)',
  GIPAOAgri_1:
    'Primary Area of Operation in Agriculture - Arable farming (grains, vegetables, legumes, fruits, plant propagation, etc.',
  GIPAOAgri_2:
    'Primary Area of Operation in Agriculture - Perennial agriculture or permanent farming (almonds, olives, walnuts. hazelnuts, etc.)',
  GIPAOAgri_3:
    'Primary Area of Operation in Agriculture - Livestock farming (meat, dairy, other)',
  GIPAOAgri_4:
    'Primary Area of Operation in Agriculture - Mixed farming (crops and animals)',
  GIPAOAgri_5:
    'Primary Area of Operation in Agriculture - Service and support (farm management services, crop services, post-harvest handling services, etc.)',
  GIPAOAgri_6: 'Primary Area of Operation in Agriculture - Other namely',
  GIPAOAgriOther: 'Other namely ...',
  GIPAOForest_1: 'Primary Area of Operation in forestry - Reforestation',
  GIPAOForest_2:
    'Primary Area of Operation in forestry - Forest conservation - thinning, pruning, weed & pest control',
  GIPAOForest_3: 'Primary Area of Operation in forestry - Felling',
  GIPAOForest_4:
    'Primary Area of Operation in forestry - Non-Timber Forest Products (NTFPs)',
  GIPAOForest_5:
    'Primary Area of Operation in forestry - Transportation of logs',
  GIPAOForest_6:
    'Primary Area of Operation in forestry - Forest Fire Management',
  GIPAOForest_7:
    'Primary Area of Operation in forestry - Forestry inventory and mapping',
  GIPAOForest_8:
    'Primary Area of Operation in forestry - Wildlife management',
  GIPAOForest_9: 'Primary Area of Operation in forestry - Other namely',
  GIPAOForestOther: 'Other namely ...',
  GIOSize: 'Agriculture/Forestry organization size',
  GIOrgType: 'What type of organisation are you?',
  GIOrgTypeOther: 'Other namely ...',
  GIGeoReach: 'What is the geographical reach of the services that you offer?',
  AdoptPerc:
    'What percentage of your products or services are specifically targeted at the agricultural and forestry sectors?',
  AdoptUserType:
    'What type of users do you primarily provide your technology to?',
  AdoptUserTypeOther: 'Other namely...',
  AdoptSalesModel_1:
    'What sales model do you primarily use for your products/services? - Subscription-based',
  AdoptSalesModel_2:
    'What sales model do you primarily use for your products/services? - One-time lump sum payment',
  AdoptSalesModel_3:
    'What sales model do you primarily use for your products/services? - Usage-based',
  AdoptSalesModel_4:
    'What sales model do you primarily use for your products/services? - Freemium',
  AdoptSalesModel_5:
    'What sales model do you primarily use for your products/services? - Licensing',
  AdoptSalesModel_6:
    'What sales model do you primarily use for your products/services? - Other, namely',
  AdoptSalesModelOther: 'Other namely...',
  AdoptDataType_1:
    'What types of data do your products or services generate or rely on? - Soil health data',
  AdoptDataType_2:
    'What types of data do your products or services generate or rely on? - Climate/weather data',
  AdoptDataType_3:
    'What types of data do your products or services generate or rely on? - Crop yield data',
  AdoptDataType_4:
    'What types of data do your products or services generate or rely on? - Sensor-based data',
  AdoptDataType_5:
    'What types of data do your products or services generate or rely on? - Geospatial data',
  AdoptDataType_6:
    'What types of data do your products or services generate or rely on? - Other, namely',
  AdoptDataTypeOther: 'Other namely...',
  ACPMarket:
    'Do you conduct market research or needs assessments before developing digital solutions for agriculture and forestry?',
  ACPUserNeeds:
    'Do you prioritize user needs within the agricultural and forestry sectors during the development phase?',
  ACPCostStr:
    'Can you provide insights into the cost structure associated with implementing and maintaining your technology?',
  ACPCostStrSp: 'If yes, please specify',
  ACPPenetr:
    'Do you employ specific strategies to penetrate diverse markets within agriculture and forestry?',
  ACPPenetrSp: 'If yes, please specify',
  ACPAfterSales_1:
    'Do you offer any after-sales service, support, or warranty for your products or services? - Yes, we offer after-sales service and support (please specify)',
  ACPAfterSales_2:
    'Do you offer any after-sales service, support, or warranty for your products or services? - Yes, we offer warranty (please specify)',
  ACPAfterSales_3:
    'Do you offer any after-sales service, support, or warranty for your products or services? - Yes, we offer both after-sales service/support and warranty',
  ACPAfterSales_4:
    'Do you offer any after-sales service, support, or warranty for your products or services? - No, we do not offer after-sales service, support, or warranty',
  ACPAfterSales_5:
    'Do you offer any after-sales service, support, or warranty for your products or services? - Other, namely',
  ACPAfterSalesOther: 'Other namely...',
  ACPAfterSalesSp: 'If needed, please specify',
  ADTTIntegrated:
    'Has your organisation integrated digital technologies into its workflows?',
  ADTTAgriculture_1:
    'What type of digital technology has been used for agriculture? - Farm Management Software (e.g., digital tools for holistic practical, operational or financial management of a farm etc.)',
  ADTTAgriculture_2:
    'What type of digital technology has been used for agriculture? - Guidance and Controlled Vehicle Technologies (e.g., vehicle guidance services or automatic steering etc.)',
  ADTTAgriculture_3:
    'What type of digital technology has been used for agriculture? - Map or Sensor-based Variable Rate Technologies (e.g., advice or automatic variable application of fertilizers, persiticides, or irrigation etc.)',
  ADTTAgriculture_4:
    'What type of digital technology has been used for agriculture? - Recording and Mapping Technologies (e.g., mapping or sensor-based monitoring of crops/soil/animals/weather conditions etc.)',
  ADTTAgriculture_5:
    'What type of digital technology has been used for agriculture? - Robotic Systems or Smart Machines (e.g., drones or harvesting/weeding/planting/milking robots etc.)',
  ADTTAgriculture_6:
    'What type of digital technology has been used for agriculture? - Data or Information Sharing Applications/Platforms',
  ADTTAgriculture_7:
    'What type of digital technology has been used for agriculture? - Other namely',
  ADTTAgricultureOther: 'Other namely...',
  ADTTForestry_1:
    'What type of digital technology has been used for forestry? - Mapping Technologies (e.g., satellite or aerial imagery to collect information about forest condition/health/biomass/inventory/environmental changes etc.)',
  ADTTForestry_2:
    'What type of digital technology has been used for forestry? - Field Survey Technologies (e.g., drones, ground sensors for soil/weather/fire prediction, GPS devices, Geographic Information Systems (GIS) Software etc.)',
  ADTTForestry_3:
    'What type of digital technology has been used for forestry? - Descision Support Technologies (e.g., advice or data-driven insights/reccomendations for forestry operations and management etc.)',
  ADTTForestry_4:
    'What type of digital technology has been used for forestry? - Data or Information Sharing Applications/Platforms',
  ADTTForestry_5:
    'What type of digital technology has been used for forestry? - Other namely',
  ADTTForestryOther: 'Other namely...',
  ADTTFunctions_1:
    'What are the primary functions of these technologies in the agriculture or forestry value chain? - Production phase enhancement (e.g. optimizing yields, resource efficiency)',
  ADTTFunctions_2:
    'What are the primary functions of these technologies in the agriculture or forestry value chain? - Monitoring and surveillance (e.g. crop/forest health, pest detection, environmental conditions)',
  ADTTFunctions_3:
    'What are the primary functions of these technologies in the agriculture or forestry value chain? - Supply chain optimisation (e.g. logistics, traceability, post-harvest handling)',
  ADTTFunctions_4:
    'What are the primary functions of these technologies in the agriculture or forestry value chain? - Decision-making Support (e.g. AI/ML models for recommendations)',
  ADTTFunctions_5:
    'What are the primary functions of these technologies in the agriculture or forestry value chain? - Planning and Management (e.g. Resource allocation, inventory management)',
  ADTTFunctions_6:
    'What are the primary functions of these technologies in the agriculture or forestry value chain? - Crop/Forest Health and disease detection (e.g. early detection via sensors or drones)',
  ADTTFunctions_7:
    'What are the primary functions of these technologies in the agriculture or forestry value chain? - Harvesting and distribution (e.g. automated machinery, tranportation tracking)',
  ADTTFunctions_8:
    'What are the primary functions of these technologies in the agriculture or forestry value chain? - Data collection and Management (e.g. data storage, analytics, dashboards)',
  ADTTBarriers: 'Are there specific barriers hindering further integration?',
  ADTTFunctionsSpec: 'If yes, please specify',
  NetworkYes: 'Do you have network connectivity?',
  NetworkConnect_1:
    'What network connectivity do you use? - Wired internet (e.g. DSL, Ethernet)',
  NetworkConnect_2:
    'What network connectivity do you use? - Wireless internet (Wi-Fi)',
  NetworkConnect_3:
    'What network connectivity do you use? - Cullular networks (e.g. 3G, 4G, 5G)',
  NetworkConnect_4: 'What network connectivity do you use? - Sattelite internet',
  NetworkConnect_5:
    'What network connectivity do you use? - IoT specific Networks (e.g. LPWAN, LoRaWan, Zigbee)',
  NetworkConnect_6:
    'What network connectivity do you use? - Fiber optic networks',
  NetworkConnect_7:
    'What network connectivity do you use? - Private networks (e.g. corporate or organizational networks)',
  NetworkReliability:
    'How reliable is the current network connectivity? (1 being not reliable, 5 being very reliable)',
  NetworkDigital:
    'Would you further adopt digital technologies if you had better network connectivity?',
  DMDSTypes:
    'What type of data sharing practices related to digital technology does your organisation use?',
  DMDSDataTypes_1:
    'What type of data do you collect? - Crop and Yield Data (e.g., production quantities, quality metrics)',
  DMDSDataTypes_2:
    'What type of data do you collect? - Soil Data (e.g., pH levels, nutrient content, moisture)',
  DMDSDataTypes_3:
    'What type of data do you collect? - Weather and Environmental Data (e.g., temperature, precipitation, air quality)',
  DMDSDataTypes_4:
    'What type of data do you collect? - Pest and Disease Data (e.g., infestations, outbreaks, treatments)',
  DMDSDataTypes_5:
    'What type of data do you collect? - Inventory and Equipment Data (e.g., machinery status, stock levels)',
  DMDSDataTypes_6:
    'What type of data do you collect? - Market and Economic Data (e.g., prices, demand trends, cost analysis)',
  DMDSDataTypes_7:
    'What type of data do you collect? - Remote Sensing and Geospatial Data (e.g., satellite imagery, GIS mapping)',
  DMDSDataTypes_8:
    'What type of data do you collect? - Livestock Data (e.g., health, productivity, breeding)',
  DMDSDataTypes_9:
    'What type of data do you collect? - Financial and Operational Data (e.g., expenses, profits, workflow efficiency)',
  DMDSTools_1:
    'What type of tools or platforms do you use to collect data? - Field Data Collection Tools (e.g., mobile apps, handheld devices)',
  DMDSTools_2:
    'What type of tools or platforms do you use to collect data? - Precision Agriculture and Forestry Technology (e.g., variable rate technology, GPS-guided equipment)',
  DMDSTools_3:
    'What type of tools or platforms do you use to collect data? - IoT Devices and Sensors (e.g., soil moisture sensors, weather stations, livestock trackers)',
  DMDSTools_4:
    'What type of tools or platforms do you use to collect data? - Remote Sensing Platforms (e.g., drones, satellites)',
  DMDSTools_5:
    'What type of tools or platforms do you use to collect data? - Farm and Forest Management Software (e.g., FMIS, forest management system)',
  DMDSTools_6:
    'What type of tools or platforms do you use to collect data? - Traceability and Supply Chain Systems (e.g., blockchain for tracking produce, timber certification systems)',
  DMDSTools_7:
    'What type of tools or platforms do you use to collect data? - Research Data platforms (e.g., academic databases)',
  DMDSPay: 'Do you pay for this data?',
  DMDSDepend: 'Would you be able to operate without this data?',
  DSDFStorage_1:
    'Where and how do you store this data? - On-premises servers/local storage facilities',
  DSDFStorage_2: 'Where and how do you store this data? - Cloud-based platforms',
  DSDFStorage_3: 'Where and how do you store this data? - Data warehouses',
  DSDFStorage_4:
    'Where and how do you store this data? - Agricultural information management systems',
  DSDFStorage_5:
    'Where and how do you store this data? - Geographic Information Systems (GIS)',
  DSDFStorage_6:
    'Where and how do you store this data? - Hybrid storage solutions (on-premises and cloud)',
  DSDFStorage_7: 'Where and how do you store this data? - Other, namely',
  DSDFStorageOther: 'Other namely...',
  DSDFSharing: 'Do you share the data you have collected with others?',
  // Corrected: Python script has "To who" which mismatches question-indicators.sql
  DSDFSending: 'To whom and where do you send this data?',
  EcoBenefitSavings:
    'Digital technologies have resulted in cost savings or increased efficiency in our operations.',
  EnvironContribute:
    'Digital technologies have positively contributed to sustainability and environmental practices in our organization.',
  FOUpgrade:
    'Our organization plans to expand or upgrade its current digital infrastructure in the near future.',
  ACInput:
    'Please share any other input that could be relevant to the questionnaire',
  Q_DataPolicyViolations: 'Q_DataPolicyViolations',
};

export function getQuestionTextByShortCode(
  shortCode: string,
): string | undefined {
  return QUALTRICS_MAPPING[shortCode];
}

/**
 * Normalizes a string for fuzzy matching (strips non-alphanumeric, lowercases).
 * Mirrors Python's: re.sub(r'[^a-zA-Z0-9]', '', str(value)).lower()
 */
function normalize(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

/**
 * Given an OData column name (Level2 text from the Fact table), find the
 * matching full question text from QUALTRICS_MAPPING.
 * Mirrors Python's get_level3_text() function.
 */
export function getLevel3Text(level2Text: string): string {
  const normLevel2 = normalize(level2Text);

  for (const [shortCode, fullText] of Object.entries(QUALTRICS_MAPPING)) {
    const normShortCode = normalize(shortCode);
    const normFullText = normalize(fullText);

    if (normShortCode && normLevel2.includes(normShortCode)) {
      return fullText;
    }

    if (
      normLevel2 &&
      (normLevel2.includes(normFullText) || normFullText.includes(normLevel2))
    ) {
      return fullText;
    }
  }

  return '';
}
