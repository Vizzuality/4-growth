DELETE FROM public.page_filters;

-- Sections in the survey

-- Section 1 - General Information
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('sector', 'Sector','Agriculture;Forestry;Both;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('type-of-stakeholder', 'Type of stakeholder', 'Farmer/agricultural producers;Forester;Forest owner;Forest operator;Forest product processor;Farming association;Farming cooperative;Forestry association;Forest industry association;Trade association;NGO/Advisory Group;Data association/organisation/coalition;Data provider;Infrastructure provider;Platform provider;Service/Information provider;Digital technology provider;Research institutes and research networks;National and European networks;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('location-country-region', 'Location (Country/Region)','Austria;Belgium;Bulgaria;Croatia;Cyprus;Czechia;Denmark;Estonia;Finland;France;Germany;Greece;Hungary;Ireland;Italy;Latvia;Lithuania;Luxembourg;Malta;Poland;Portugal;Romania;Slovakia;Slovenia;Spain;Sweden;The Netherlands');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('primary-area-of-operation-in-agriculture', 'Primary area of operation in agriculture','Crop cultivation- grains;Crop cultivation- vegetables;Crop cultivation- legumes;Crop cultivation- fruits;Plant propagation;Livestock farming - meat;Livestock farming- dairy;Livestock farming- other;Mixed Farming (crops and animal);Agricultural machinery and equipment services;Crop services (monitoring);Farm management services;Post-harvest handling services;Other;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('primary-area-of-operation-in-forestry', 'Primary area of operation in forestry','Reforestation;Forest conservation - thinning, pruning, weed & pest control;Felling;Transportation of logs;Non-Timber Forest Products (NTFPs);Forest Fire Management;Forestry inventory and mapping;Wildlife management;Other;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('organic-farming-operation', 'Organic farming operation','Yes;No;Don''t know;N/A');

-- Section 2 - Governance Model
-- INSERT INTO public.page_filters ("name", "label", "values") VALUES ('governance-model-impact', 'Governance model impact','Facilitated;Hindered;No impact;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('regulatory-considerations', 'Regulatory considerations','Yes;No;Don''t know;N/A');

-- Section 3 - Adoption of Digital Technologies and Technology Integration
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('digital-technologies-integrated', 'Digital technologies integrated','Yes;No;Don''t know;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('technology-type-agriculture', 'Technology type (Agriculture)','Precision Farming;Farm Management Information Systems;Automated machinery and robotics;Smart Irrigation systems;Monitoring and tracking of livestock/crops;Smart-agri apps;Other (please specify);N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('technology-type-forestry', 'Technology type (Forestry)','Forest Inventory Management Software;Drones for Forest Monitoring;Autonomated machinery and robotics;Forest Fire Prediction and Monitoring Systems;Other (please specify);N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('goals-or-challenges', 'Goals or challenges','Yes;No;Don''t know;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('level-of-digitalization', 'Level of digitalization','1;2;3;4;5;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('primary-functions', 'Primary functions','On-farm activities;Production phase;Monitoring;Supply chain optimisation;Decision-making;Planning and management;Crop health and disease detection;Harvesting and distribution;Data management;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('adoption-level', 'Adoption level','Fully integrated;Advanced;Preliminary;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('challenges-in-the-adoption', 'Challenges in the adoption','Yes;No;Don''t know;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('barriers', 'Barriers','Yes;No;Don''t know;N/A');

-- Section 4 - Technology Performance
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('limitations-or-challenges', 'Limitations or challenges','Yes;No;Don''t know;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('network-connectivity', 'Network connectivity','Yes;No;Don''t know;N/A');

-- Section 6 - Data Management and Data Sharing Practices
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('data-collection', 'Data collection','Yes;No;Don''t know;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('type-of-data-collected', 'Type of data collected','Crop and yield data;Soil data;Weather and environmental data;Pest and disease data;Inventory and equipment data;Market and economic data;Remote sensing and geospatial data;Livestock data;Financial and operational data;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('data-payments', 'Data payments','Yes;No;Don''t know;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('data-sharing', 'Data sharing','Yes;No;Don''t know;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('challenges-in-data-sharing', 'Challenges in data sharing','Yes;No;Don''t know;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('overall-contribution', 'Overall contribution','Contribute;Impede;No impact;N/A');

-- Section 8 - Social Benefits and Impact
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('social-benefits', 'Social benefits','Yes;No;Don''t know;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('overall-social-impact', 'Overall social impact','Positive;Neutral;Negative;N/A');

-- Section 9 - Economic Benefits and Impact
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('cost-savings-efficiency', 'Cost savings and efficiency','Yes;No;Don''t know;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('savings-in-inputs', 'Savings in inputs','Yes;No;Don''t know;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('overall-economic-impact', 'Overall economic impact','Positive;Neutral;Negative;N/A');

-- Section 10 - Environmental and Sustainability Impact
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('effects-on-biodiversity', 'Effects on biodiversity','Positive;Negative;No impact;N/A');

-- Section 11 - Future Outlook
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('plans-to-expand-or-upgrade', 'Plans to expand or upgrade','Yes;No;Don''t know;N/A');
