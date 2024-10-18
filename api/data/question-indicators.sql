INSERT INTO question_indicator_map ("indicator", "question") VALUES
    -- Not questions in the survey but widgets only
    ('total-countries', ''),
    ('total-surveys', ''),
    ('adoption-of-technology-by-country', 'Has your organisation integrated digital technologies into its workflows?'),
    -- Sections in the survey
    -- Section 1 - General Information
    ('organisation-by-sector', 'Sector (Agri/Forestry/Both)'),
    ('eu-member-state', 'Location (Country/Region)'),
    ('type-of-stakeholder', 'Type of stakeholder'),
    ('in-agriculture', 'Primary Area of Operation in agriculture'),
    ('in-forestry', 'Primary Area of Operation in forestry'),
    -- Section 2 - Workforce information
    ('organisation-size', 'What is the size of your agriculture or forestry organisation in terms of workforce?'),
    ('education-level', 'What is the general education level/attainment of your workforce?'),
    ('experience-level', 'What is the general level of work experience in your organisation?'),
    ('training-on-digital-technologies', 'Have your staff received training on the use of digital technologies?'),
    ('workforce-training', 'If yes, what percentage of the workforce received this training?'),
    -- Section 3 - Governance model
    ('governance-model-impact', 'Have specific governance models either facilitated or hindered the adoption of digital technologies in your organization?'),
    ('governance-model-type', 'What type of governance model do you operate under?'),
    ('regulatory-considerations', 'Are there regulatory considerations influencing the governance of digital technology adoption?'),
    -- Section 4 - Adoption of Digital Technologies and Technology Integration
    ('digital-technologies-integrated', 'Has your organisation integrated digital technologies into its workflows?'),
    ('technology-type-agriculture', 'What type of digital technology has been used for agriculture?'),
    ('technology-type-forestry', 'What type of digital technology has been used for forestry?'),
    ('goals-or-challenges', 'Were there specific goals or challenges that prompted the adoption of digital tools?'),
    ('level-of-digitalization', 'How would you rate the level of digitalization in your farming/forestry practices on a scale of 1 to 5 (1 being low, 5 being high)'),
    ('primary-functions', 'What are the primary functions of these technologies in the agriculture or forestry value chain?'),
    ('adoption-level', 'What is the adoption level of these technologies?'),
    ('challenges-in-the-adoption', 'Have you encountered challenges in the adoption of digital technologies?'),
    ('barriers', 'Are there specific barriers hindering further integration?'),
    -- Section 5 - Technology performance
    ('user-needs', 'To what extent do digital technologies meet evolving user needs within your organization?'),
    ('advantages', 'What are the advantages of the used technologies?'),
    ('limitations-or-challenges', 'Have you encountered any perceived limitations or challenges in utilising these technologies?'),
    ('network-connectivity', 'Do you have network connectivity?'),
    ('network-connectivity-type', 'What network connectivity do you use?'),
    ('level-of-reliability', 'How reliable is the current network connectivity?'),
    ('device-type', 'What type of devices are commonly used to access the network?'),
    -- Section 6 - Associated costs and prerequisites
    ('most-significant-costs', 'What are the most significant costs associated with the adoption of digital technologies in your organisation'),
    ('direct-costs', 'What is the level of direct costs?'),
    ('unexpected-or-hidden-costs', 'Unexpected or hidden costs?'),
    ('organisational-prerequisites', 'Have you identified organisational prerequisites (skills, workforce, education) necessary for successful technology integration?'),
    -- Section 7 - Data management and data sharing practices
    ('data-collection', 'Is data collected from your farming/forestry activities?'),
    ('data-sharing', 'What type of data sharing practices related to digital technology does your organisation use?'),
    ('type-of-data', 'What type of data do you collect?'),
    ('data-payments', 'Do you pay for this data?'),
    ('types-of-tools-or-platforms', 'What type of tools or platforms do you use to collect data?'),
    ('challenges', 'Do challenges exist in sharing and interoperability of agricultural and forestry data?'),
    -- Section 8 -- Data storage and data flows
    ('data-storage', 'Where and how do you store this data?'),
    -- Section 9 -- Socio-economic benefits and impact
    ('overall-contribution', 'How do these practices contribute to or impede the overall effectiveness of technology adoption?'),
    ('socio-economic-benefits', 'Have you experienced socio-economic benefits through the use of digital technologies?'),
    ('cost-savings/efficiency', 'Have digital technologies resulted in cost savings or increased efficiency?'),
    ('savings-in-inputs', 'Savings in inputs?'),
    ('overall-revenue', 'Increase in Overall revenue?'),
    ('job-creation-impact', 'Impact on job creation?'),
    ('overall-socio-economic-impact', 'Overall Socio-economic Impact?'),
    -- Section 10 -- Environmental and sustainability impact
    ('sustainability', 'Have digital technologies contributed to sustainability and environmental practices?'),
    ('conservation', 'Have you observed positive impacts on resource conservation or environmental footprint?'),
    ('energy-efficiency', 'Have digital technologies contributed to energy efficiency?'),
    ('effects-on-biodiversity', 'Have you observed any positive or negative effects on biodiversity in agricultural and forestry areas due to digital technology adoption?'),
    ('track-and-ensure-adherence', 'Do you use digital technologies to track and ensure adherence to sustainable farming practices and forestry activities?'),
    -- Section 11 -- Future outlook
    ('plans-to-expand/upgrade', 'Are there plans to expand or upgrade your current digital infrastructure?'),
    ('future-expansion/upgrade', 'What would help facilitate the expansion/upgrade of digital infrastructure in the future?')
ON CONFLICT (indicator, question) DO NOTHING;