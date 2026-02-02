INSERT INTO question_indicator_map ("indicator", "question") VALUES
    -- Section 1 - General Information
    ('organisation-name', 'Organisation Name'),
    ('sector', 'Sector (agri/forestry/both)'),
    ('type-of-stakeholder', 'Type of stakeholder'),
    ('location-country-region', 'Location (country/region)'),
    ('primary-area-of-operation-in-agriculture', 'Primary area of operation in agriculture'),
    ('primary-area-of-operation-in-agriculture-other', 'If other, please specify'),
    ('primary-area-of-operation-in-forestry', 'Primary area of operation in forestry'),
    ('primary-area-of-operation-in-forestry-other', 'If other, please specify'),
    ('organic-farming-operation', 'Organic farming operation'),
    ('organisation-size', 'Agriculture/forestry organisation size'),
    ('regional-or-subsector-considerations', 'Are there specific regional or subsector considerations that should be taken into account when interpreting your responses?'),
    ('considerations-to-be-taken-into-account', 'Considerations to be taken into account'),

    -- Section 2 - Governance Model
    -- ('governance-model-impact', 'Have specific governance models either facilitated or hindered the adoption of digital technologies in your organization?'),
    ('governance-model-type', 'What type of governance model do you operate under?'),
    ('governance-model-type-other', 'If other, please specify'),
    ('regulatory-considerations', 'Are there regulatory considerations influencing the governance of digital technology adoption?'),
    ('regulatory-considerations-details', 'If yes, please specify'),

    -- Section 3 - Adoption of Digital Technologies and Technology Integration
    ('digital-technologies-integrated', 'Has your organisation integrated digital technologies into its workflows?'),
    ('technology-type-agriculture', 'What type of digital technology has been used for agriculture?'),
    ('technology-type-agriculture-other', 'If other, please specify'),
    ('technology-type-forestry', 'What type of digital technology has been used for forestry?'),
    ('technology-type-forestry-other', 'If other, please specify'),
    ('goals-or-challenges', 'Were there specific goals or challenges that prompted the adoption of digital tools?'),
    ('goals-or-challenges-details', 'If yes, please specify'),
    ('level-of-digitalization', 'How would you rate the level of digitalization in your farming/forestry practices on a scale of 1 to 5 (1 being low, 5 being high)'),
    ('primary-functions', 'What are the primary functions of these technologies in the agriculture or forestry value chain?'),
    ('adoption-level', 'What is the adoption level of these technologies?'),
    ('challenges-in-the-adoption', 'Have you encountered challenges in the adoption of digital technologies?'),
    ('challenges-in-the-adoption-details', 'If yes, please specify'),
    ('barriers', 'Are there specific barriers hindering further integration?'),
    ('barriers-details', 'If yes, please specify'),

    -- Section 4 - Technology Performance
    ('user-needs', 'To what extent do digital technologies meet evolving user needs within your organization?'),
    ('advantages', 'What are the advantages of the used technologies?'),
    ('advantages-other', 'If other, please specify'),
    ('limitations-or-challenges', 'Have you encountered any perceived limitations or challenges in utilising these technologies?'),
    ('limitations-or-challenges-details', 'If yes, please specify'),
    ('network-connectivity', 'Do you have network connectivity?'),
    ('network-connectivity-type', 'What network connectivity do you use?'),
    ('level-of-reliability', 'How reliable is the current network connectivity? (1 being not reliable, 5 being very reliable)'),
    ('connectivity-barriers', 'Are there any specific barriers to accessing connectivity?'),
    ('device-type', 'What type of devices are commonly used to access the network?'),

    -- Section 5 - Associated Costs and Prerequisites
    ('most-significant-costs', 'What are the most significant costs associated with the adoption of digital technologies in your organisation'),
    ('most-significant-costs-other', 'If other, please specify'),
    ('direct-costs', 'What is the level of direct costs?'),
    ('unexpected-or-hidden-costs', 'Unexpected or hidden costs?'),
    ('organisational-prerequisites', 'Have you identified organisational prerequisites (skills, workforce, education) necessary for successful technology integration?'),
    ('organisational-prerequisites-details', 'If yes, please specify'),

    -- Section 6 - Data Management and Data Sharing Practices
    ('data-collection', 'Is data collected from your farming/forestry activities?'),
    ('data-sharing-practices', 'What type of data sharing practices related to digital technology does your organisation use?'),
    ('type-of-data-collected', 'What type of data do you collect?'),
    ('data-payments', 'Do you pay for this data?'),
    ('types-of-tools-or-platforms', 'What type of tools or platforms do you use to collect data?'),
    ('data-sharing', 'Do you share this data?'),
    ('challenges-in-data-sharing', 'Do challenges exist in sharing and interoperability of agricultural and forestry data?'),
    ('challenges-in-data-sharing-details', 'If yes, please name the challenges'),
    ('overall-contribution', 'How do these practices contribute to or impede the overall effectiveness of technology adoption?'),
    ('percentage-data-driven-decisions', 'Approximately what percentage of overall decisions made are based on data analytics in your organisation?'),

    -- Section 7 - Data Storage and Data Flows
    ('data-storage', 'Where and how do you store this data?'),
    ('cloud-services', 'Do you use cloud services/data centres?'),
    ('cloud-services-details', 'If yes, please name which cloud services/data centres'),
    ('data-flows-economic-implications', 'Are there economic implications associated with data flows in these sectors?'),
    ('data-flows-economic-implications-details', 'If yes, please name the main implications'),
    ('data-flows-enhance-productivity', 'Do data flows enhance productivity and efficiency in agriculture and forestry?'),
    ('data-driven-decisions', 'Do you use data analytics for decision-making?'),
    ('data-receipt', 'Where do you receive data from and how much?'),
    ('type-of-data-received-or-provided', 'What type of data do you receive or provide?'),
    ('data-payments-received', 'Do you pay for this data?'),
    ('data-payments-received-details', 'If yes, please specify'),
    ('data-storage-received-data', 'Where and how do you store this data?'),
    ('data-usage', 'What do you do with this data?'),
    ('data-distribution', 'To whom and where do you send derived information or data?'),

    -- Section 8 - Social Benefits and Impact
    ('social-benefits', 'Have you experienced social benefits through the use of digital technologies?'),
    ('job-creation-impact', 'How have digital technologies impacted job creation?'),
    ('overall-social-impact', 'What is the overall social impact of adopting digital technologies?'),

    -- Section 9 - Economic Benefits and Impact
    ('cost-savings-efficiency', 'Have digital technologies resulted in cost savings or increased efficiency?'),
    ('savings-in-inputs', 'Have you seen savings in inputs due to digital technologies?'),
    ('overall-economic-impact', 'What is the overall economic impact of implementing digital technologies?'),

    -- Section 10 - Environmental and Sustainability Impact
    ('sustainability', 'Have digital technologies contributed to sustainability and environmental practices?'),
    ('conservation', 'Have you observed positive impacts on resource conservation or environmental footprint?'),
    ('energy-efficiency', 'Have digital technologies contributed to energy efficiency?'),
    ('effects-on-biodiversity', 'Have you observed any positive or negative effects on biodiversity in agricultural and forestry areas due to digital technology adoption?'),
    ('track-and-ensure-adherence', 'Do you use digital technologies to track and ensure adherence to sustainable farming practices and forestry activities?'),

    -- Section 11 - Future Outlook
    ('plans-to-expand-or-upgrade', 'Are there plans to expand or upgrade your current digital infrastructure?'),
    ('future-expansion-upgrade', 'What would help facilitate the expansion/upgrade of digital infrastructure in the future?'),
    ('future-developments', 'What type of developments do you anticipate in the near future?'),

    -- Section 12 - Additional Comments
    ('additional-comments', 'Please share any other input that could be relevant to the questionnaire'),

    -- Not questions in the survey but widgets in the overview section
    ('total-countries', ''),
    ('total-surveys', ''),
    ('adoption-of-technology-by-country', 'Has your organisation integrated digital technologies into its workflows?'),

    -- Wave 2 New Questions

    -- New W2 General Information
    ('organisation-type', 'What type of organisation are you?'),
    ('geographical-reach', 'What is the geographical reach of the services that you offer?'),

    -- New W2 Technology Performance
    ('further-adoption-with-connectivity', 'Would you further adopt digital technologies if you had better network connectivity?'),

    -- New W2 Data Management
    ('operate-without-data', 'Would you be able to operate without this data?'),

    -- New W2 Data Storage & Flows
    ('data-recipients', 'To whom and where do you send this data?'),

    -- New W2 Tech Providers section
    ('tech-provider-agri-forestry-percentage', 'What percentage of your products or services are specifically targeted at the agricultural and forestry sectors?'),
    ('tech-provider-sales-model', 'What sales model do you primarily use for your products/services?'),
    ('tech-provider-user-type', 'What type of users do you primarily provide your technology to?'),
    ('tech-provider-data-types', 'What types of data do your products or services generate or rely on?'),

    -- New W2 Associated Costs (tech providers)
    ('tech-provider-cost-structure', 'Can you provide insights into the cost structure associated with implementing and maintaining your technology?'),
    ('tech-provider-market-research', 'Do you conduct market research or needs assessments before developing digital solutions for agriculture and forestry?'),
    ('tech-provider-market-penetration', 'Do you employ specific strategies to penetrate diverse markets within agriculture and forestry?'),
    ('tech-provider-aftersales', 'Do you offer any after-sales service, support, or warranty for your products or services?'),
    ('tech-provider-user-priorities', 'Do you prioritize user needs within the agricultural and forestry sectors during the development phase?')
ON CONFLICT (indicator) DO UPDATE SET question = EXCLUDED.question;
