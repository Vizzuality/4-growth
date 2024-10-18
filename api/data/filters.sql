DELETE FROM public.page_filters;
-- Sections in the survey
-- Section 1 - General Information
INSERT INTO public.page_filters VALUES ('organisation-by-sector', 'Agriculture;Forestry;Both');
INSERT INTO public.page_filters VALUES ('type-of-stakeholder', 'Farmer/agricultural producers;Forester;Forest owner;Forest operator;Forest product processor;Farming association;Farming cooperative;Forest industry association;Trade association;NGO/Advisory Group;Data association/organisation/coalition;Data provider;Platform provider;Service/Information provider;Digital technology provider; Research institutes and research networks; National and European networks');
INSERT INTO public.page_filters VALUES ('eu-member-state', 'Austria;Belgium;Bulgaria;Croatia;Cyprus;Czechia;Denmark;Finland;France;Germany;Greece;Hungary;Italy;Latvia;Lithuania;Luxembourg;Malta;Poland;Portugal;Romania;Slovakia;Slovenia;Spain;Sweden;The Netherlands');
INSERT INTO public.page_filters VALUES ('in-agriculture', 'Crop cultivation- grains;Crop cultivation- vegetables;Crop cultivation- legumes;Crop cultivation- fruits;Plant propagation;Livestock farming - meat;Livestock farming- dairy;Mixed Farming (crops and animal);Agricultural machinery and equipment services;Crop services (monitoring);Farm management services;Post-harvest handling services ');
INSERT INTO public.page_filters VALUES ('in-forestry', 'Reforestation;Forest conservation - thinning, pruning, weed & pest control;Felling;Transportation of logs;Non-Timber Forest Products (NTFPs);Forest Fire Management;Forestry inventory and mapping;Other');
-- Section 2 - Workforce information
INSERT INTO public.page_filters VALUES ('organisation-size', 'Small-scale/Local;Medium-scale/Local-National;Large Scale/National-International');
INSERT INTO public.page_filters VALUES ('education-level', 'High education;Advanced education;Technical and Vocational Education;Basic education');
INSERT INTO public.page_filters VALUES ('experience-level', 'Experts;Mid-level professionals;Early-career/Entry level');
INSERT INTO public.page_filters VALUES ('training-on-digital-technologies', 'Training programmes;Workshops;Seminars;Other');
-- Section 3 - Governance model
INSERT INTO public.page_filters VALUES ('governance-model-type', 'Traditional/Subsistence Agriculture or Forestry;Cooperative Agriculture or Forestry;Corporate Agriculture or Forestry;Contract Farming or Forestry;Community Supported Agriculture or Forestry;Land trust and conservation Agriculture or Forestry;Other');
-- Section 4 - Adoption of Digital Technologies and Technology Integration
INSERT INTO public.page_filters VALUES ('technology-type-agriculture', 'Precision Farming;Farm Management Information Systems;Automated machinery and robotics;Smart Irrigation systems;Monitoring and tracking  of livestock/crops;Smart-agri apps;Other (please specify)');
INSERT INTO public.page_filters VALUES ('technology-type-forestry', 'Forest Inventory Management Software;Drones for Forest Monitoring;Autonomated machinery and robotics;Forest Fire Prediction and Monitoring Systems;Other (please specify)');
INSERT INTO public.page_filters VALUES ('level-of-digitalization', '1;2;3;4;5');
INSERT INTO public.page_filters VALUES ('primary-functions', 'On-farm activities;Production phase;Monitoring;Supply chain optimisation;Decision-making;Planning and management;Crop health and desease detection;Harvesting and distribution;Data management');
INSERT INTO public.page_filters VALUES ('adoption-level', 'Fully integrated;Advanced;Preliminary');
-- Section 5 - Technology performance
INSERT INTO public.page_filters VALUES ('advantages', 'Increased efficiency and productivity;Improved decision-making;Efficient Resource Allocation;Traceability and Transparency;Early Detection of Issues;Economic Benefits;Smart Irrigation and Water Conservation;Improved Forest Management;Enhanced Safety and Monitoring;Other');
INSERT INTO public.page_filters VALUES ('limitations-or-challenges', 'High costs (initial and/or operational);Complexity;Skills and Training Requirements;Limited Accessibility and Connectivity;Interoperability Issues;Data Privacy and Security Concerns;Resistance to Change;Other;Farm-level data;Earth Observation (EO) data;Environmental data;Socio-economic data;Supply chain data;Research and Development data');
INSERT INTO public.page_filters VALUES ('network-connectivity', 'Wired internet;Wireless internet;Cellular networks;Satellite internet;IoT networks;Fiber Optic Networks;Private Networks;Low-Power Wide-Area Network');
INSERT INTO public.page_filters VALUES ('level-of-reliability', '1;2;3;4;5');
INSERT INTO public.page_filters VALUES ('device-type', 'Desktop computers;Laptop computers;Tablets;Smartphones;GPS devices;Agricultural machinery equipped with IoT (Internet of Things) sensors');
-- Section 6 - Associated costs and prerequisites
INSERT INTO public.page_filters VALUES ('most-significant-costs', 'Initial investment;Connectivity infrastructure;Maintenance and upgrades;Energy;Integration with Existing Systems;Training and Skill Development;Data Security and Privacy Measures;Software development and privacy measures;Other');
INSERT INTO public.page_filters VALUES ('direct-costs', 'High;Moderate;Low');
-- Section 7 - Data management and data sharing practices
INSERT INTO public.page_filters VALUES ('data-sharing', 'Open sharing;Restricted sharing;No sharing');
INSERT INTO public.page_filters VALUES ('type-of-data', 'Crop and yield data;Soil data;Weather and environmental data;Pest and disease data;Inventory and equipment data;Market and economic data;Remote sensing and geospatial data;Livestock data;Financial and operational data');
INSERT INTO public.page_filters VALUES ('types-of-tools-or-platforms', 'Field Data Collection Apps;Precision Agriculture Technology;IoT Devices;Remote Sensing Platforms;Farm Management Software;Forest Management Software;Forest Inventory Tools;Traceability Systems;Research Databases');
INSERT INTO public.page_filters VALUES ('data-storage', 'On-premises servers/local storage facilities;Cloud-based platforms;Data warehouses;Agricultural information management systems;Geographic Information Systems (GIS);Hybrid storage solutions (on-premises and cloud);secire data centres (advanced security measures)');
-- Section 9 -- Socio-economic benefits and impact
INSERT INTO public.page_filters VALUES ('overall-contribution', 'Contribute;Impede;No impact');
INSERT INTO public.page_filters VALUES ('savings-in-inputs', 'Significant;Moderate;Minimal');
INSERT INTO public.page_filters VALUES ('job-creation-impact', 'Substantial impact;Moderate impact;Negligible impact');
INSERT INTO public.page_filters VALUES ('overall-socio-economic-impact', 'Positive;Neutral;Negative');
-- Section 10 -- Environmental and sustainability impact
INSERT INTO public.page_filters VALUES ('effects-on-biodiversity', 'Positive;Negative;No impact');
-- Section 11 -- Future outlook
INSERT INTO public.page_filters VALUES ('future-expansion/upgrade', 'Better connectivity/Infrastructure;More income/Access to funding;Standardisation efforts/Regulatory support;Better training and education');