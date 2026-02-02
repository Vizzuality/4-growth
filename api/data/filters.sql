DELETE FROM public.page_filters;

-- Section 1 - General Information
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('sector', 'Sector','Agriculture;Forestry;Both;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('type-of-stakeholder', 'Type of stakeholder', 'Farmer/agricultural producers;Forester;Forest owner;Forest operator;Forest product processor;Farming association;Farming cooperative;Forestry association;Forest industry association;Trade association;NGO/Advisory Group;Data association/organisation/coalition;Data provider;Infrastructure provider;Platform provider;Service/Information provider;Digital technology provider;Research institutes and research networks;National and European networks;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('location-country-region', 'Location (Country/Region)','Albania;Andorra;Austria;Belgium;Bulgaria;Croatia;Cyprus;Czechia;Denmark;Estonia;Finland;France;Germany;Greece;Hungary;Ireland;Italy;Latvia;Lithuania;Luxembourg;Malta;Poland;Portugal;Romania;Slovakia;Slovenia;Spain;Sweden;The Netherlands');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('primary-area-of-operation-in-forestry', 'Primary area of operation in forestry','Reforestation;Forest conservation - thinning, pruning, weed & pest control;Felling;Transportation of logs;Non-Timber Forest Products (NTFPs);Forest Fire Management;Forestry inventory and mapping;Wildlife management;Other;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('organisation-size', 'Organisation size','Micro (1-9 employees);Small (10-49 employees);Medium (50-249 employees);Large (250+ employees);N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('organisation-type', 'Organisation type','Start-up;SME;Large enterprise;Research institution;Government agency;Non-profit;Cooperative;Other;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('geographical-reach', 'Geographical reach','Local;Regional;National;European;Global;N/A');

-- Section 2 - Adoption of Digital Technologies
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('digital-technologies-integrated', 'Digital technologies integrated','Yes;No;Don''t know;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('technology-type-agriculture', 'Technology type (Agriculture)','Precision Farming;Farm Management Information Systems;Automated machinery and robotics;Smart Irrigation systems;Monitoring and tracking of livestock/crops;Smart-agri apps;Farm Management Software;Other;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('technology-type-forestry', 'Technology type (Forestry)','Forest Inventory Management Software;Drones for Forest Monitoring;Automated machinery and robotics;Forest Fire Prediction and Monitoring Systems;Other;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('primary-functions', 'Primary functions','On-farm activities;Production phase;Monitoring;Supply chain optimisation;Decision-making;Planning and management;Crop health and disease detection;Harvesting and distribution;Data management;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('barriers', 'Barriers','Yes;No;Don''t know;N/A');

-- Section 3 - Technology Providers
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('tech-provider-agri-forestry-percentage', 'Agri-forestry percentage','Less than 25%;25-50%;51-75%;More than 75%;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('tech-provider-sales-model', 'Sales model','Direct sales;Subscription;Licensing;Pay-per-use;Freemium;Other;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('tech-provider-user-type', 'User type','Farmers;Foresters;Cooperatives;Associations;Processors;Retailers;Government;Research institutions;Other;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('tech-provider-data-types', 'Data types','Crop data;Soil data;Weather data;Market data;Equipment data;Financial data;Other;N/A');

-- Section 4 - Technology Performance
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('network-connectivity', 'Network connectivity','Yes;No;Don''t know;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('network-connectivity-type', 'Network connectivity type','Mobile (3G/4G/5G);Broadband;Satellite;WiFi;Other;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('level-of-reliability', 'Level of reliability','1;2;3;4;5;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('further-adoption-with-connectivity', 'Further adoption with connectivity','Yes;No;Don''t know;N/A');

-- Section 5 - Associated Costs & Prerequisites
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('tech-provider-cost-structure', 'Cost structure','Low initial cost;High initial cost;Ongoing maintenance costs;Hidden costs;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('tech-provider-market-research', 'Market research','Yes;No;Sometimes;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('tech-provider-market-penetration', 'Market penetration strategies','Yes;No;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('tech-provider-aftersales', 'After-sales support','Yes;No;Partially;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('tech-provider-user-priorities', 'User priorities in development','Yes;No;Sometimes;N/A');

-- Section 6 - Data Management
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('type-of-data-collected', 'Type of data collected','Crop and yield data;Soil data;Weather and environmental data;Pest and disease data;Inventory and equipment data;Market and economic data;Remote sensing and geospatial data;Livestock data;Financial and operational data;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('data-payments', 'Data payments','Yes;No;Don''t know;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('types-of-tools-or-platforms', 'Tools or platforms','Manual entry;Mobile apps;Sensors and IoT;Drones;Satellite imagery;Farm management software;Other;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('operate-without-data', 'Operate without data','Yes;No;Partially;N/A');

-- Section 7 - Data Storage & Flows
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('data-storage', 'Data storage','Local storage;Cloud storage;Hybrid;Paper records;Other;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('data-sharing', 'Data sharing','Yes;No;Don''t know;N/A');
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('data-recipients', 'Data recipients','Government agencies;Research institutions;Industry associations;Buyers/retailers;Service providers;Other;N/A');

-- Section 8 - Economic Impact
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('cost-savings-efficiency', 'Cost savings and efficiency','Yes;No;Don''t know;N/A');

-- Section 9 - Environmental Impact
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('sustainability', 'Sustainability','Yes;No;Don''t know;N/A');

-- Section 10 - Future Outlook
INSERT INTO public.page_filters ("name", "label", "values") VALUES ('plans-to-expand-or-upgrade', 'Plans to expand or upgrade','Yes;No;Don''t know;N/A');
