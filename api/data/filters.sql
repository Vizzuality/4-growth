DELETE FROM public.page_filters;

-- Sections in the survey

-- Section 1 - General Information
INSERT INTO public.page_filters VALUES ('sector', 'Agriculture;Forestry;Both;N/A');
INSERT INTO public.page_filters VALUES ('type-of-stakeholder', 'Farmer/agricultural producers;Forester;Forest owner;Forest operator;Forest product processor;Farming association;Farming cooperative;Forestry association;Forest industry association;Trade association;NGO/Advisory Group;Data association/organisation/coalition;Data provider;Infrastructure provider;Platform provider;Service/Information provider;Digital technology provider;Research institutes and research networks;National and European networks;N/A');
INSERT INTO public.page_filters VALUES ('location-country-region', 'Austria;Belgium;Bulgaria;Croatia;Cyprus;Czechia;Denmark;Estonia;Finland;France;Germany;Greece;Hungary;Ireland;Italy;Latvia;Lithuania;Luxembourg;Malta;Poland;Portugal;Romania;Slovakia;Slovenia;Spain;Sweden;The Netherlands;N/A');
INSERT INTO public.page_filters VALUES ('primary-area-of-operation-in-agriculture', 'Crop cultivation- grains;Crop cultivation- vegetables;Crop cultivation- legumes;Crop cultivation- fruits;Plant propagation;Livestock farming - meat;Livestock farming- dairy;Livestock farming- other;Mixed Farming (crops and animal);Agricultural machinery and equipment services;Crop services (monitoring);Farm management services;Post-harvest handling services;Other;N/A');
INSERT INTO public.page_filters VALUES ('primary-area-of-operation-in-forestry', 'Reforestation;Forest conservation - thinning, pruning, weed & pest control;Felling;Transportation of logs;Non-Timber Forest Products (NTFPs);Forest Fire Management;Forestry inventory and mapping;Wildlife management;Other;N/A');
INSERT INTO public.page_filters VALUES ('organic-farming-operation', 'Yes;No;Don''t know;N/A');

-- Section 2 - Governance Model
INSERT INTO public.page_filters VALUES ('governance-model-impact', 'Facilitated;Hindered;No impact;N/A');
INSERT INTO public.page_filters VALUES ('regulatory-considerations', 'Yes;No;Don''t know;N/A');

-- Section 3 - Adoption of Digital Technologies and Technology Integration
INSERT INTO public.page_filters VALUES ('digital-technologies-integrated', 'Yes;No;Don''t know;N/A');
INSERT INTO public.page_filters VALUES ('technology-type-agriculture', 'Precision Farming;Farm Management Information Systems;Automated machinery and robotics;Smart Irrigation systems;Monitoring and tracking of livestock/crops;Smart-agri apps;Other (please specify);N/A');
INSERT INTO public.page_filters VALUES ('technology-type-forestry', 'Forest Inventory Management Software;Drones for Forest Monitoring;Autonomated machinery and robotics;Forest Fire Prediction and Monitoring Systems;Other (please specify);N/A');
INSERT INTO public.page_filters VALUES ('goals-or-challenges', 'Yes;No;Don''t know;N/A');
INSERT INTO public.page_filters VALUES ('level-of-digitalization', '1;2;3;4;5;N/A');
INSERT INTO public.page_filters VALUES ('primary-functions', 'On-farm activities;Production phase;Monitoring;Supply chain optimisation;Decision-making;Planning and management;Crop health and disease detection;Harvesting and distribution;Data management;N/A');
INSERT INTO public.page_filters VALUES ('adoption-level', 'Fully integrated;Advanced;Preliminary;N/A');
INSERT INTO public.page_filters VALUES ('challenges-in-the-adoption', 'Yes;No;Don''t know;N/A');
INSERT INTO public.page_filters VALUES ('barriers', 'Yes;No;Don''t know;N/A');

-- Section 4 - Technology Performance
INSERT INTO public.page_filters VALUES ('limitations-or-challenges', 'Yes;No;Don''t know;N/A');
INSERT INTO public.page_filters VALUES ('network-connectivity', 'Yes;No;Don''t know;N/A');

-- Section 6 - Data Management and Data Sharing Practices
INSERT INTO public.page_filters VALUES ('data-collection', 'Yes;No;Don''t know;N/A');
INSERT INTO public.page_filters VALUES ('type-of-data-collected', 'Crop and yield data;Soil data;Weather and environmental data;Pest and disease data;Inventory and equipment data;Market and economic data;Remote sensing and geospatial data;Livestock data;Financial and operational data;N/A');
INSERT INTO public.page_filters VALUES ('data-payments', 'Yes;No;Don''t know;N/A');
INSERT INTO public.page_filters VALUES ('data-sharing', 'Yes;No;Don''t know;N/A');
INSERT INTO public.page_filters VALUES ('challenges-in-data-sharing', 'Yes;No;Don''t know;N/A');
INSERT INTO public.page_filters VALUES ('overall-contribution', 'Contribute;Impede;No impact;N/A');

-- Section 8 - Social Benefits and Impact
INSERT INTO public.page_filters VALUES ('social-benefits', 'Yes;No;Don''t know;N/A');
INSERT INTO public.page_filters VALUES ('overall-social-impact', 'Positive;Neutral;Negative;N/A');

-- Section 9 - Economic Benefits and Impact
INSERT INTO public.page_filters VALUES ('cost-savings-efficiency', 'Yes;No;Don''t know;N/A');
INSERT INTO public.page_filters VALUES ('savings-in-inputs', 'Yes;No;Don''t know;N/A');
INSERT INTO public.page_filters VALUES ('overall-economic-impact', 'Positive;Neutral;Negative;N/A');

-- Section 10 - Environmental and Sustainability Impact
INSERT INTO public.page_filters VALUES ('effects-on-biodiversity', 'Positive;Negative;No impact;N/A');

-- Section 11 - Future Outlook
INSERT INTO public.page_filters VALUES ('plans-to-expand-or-upgrade', 'Yes;No;Don''t know;N/A');
