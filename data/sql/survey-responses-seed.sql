-- Provisional

INSERT INTO survey_responses (
    start_date, end_date, status, ip_address, progress, duration_in_seconds, finished,
    recorded_date, response_id, recipient_last_name, recipient_first_name, recipient_email,
    external_data_reference, location_latitude, location_longitude, distribution_channel,
    user_language, consent_statement, agree_to_contact, name, test_entry, organisation_name,
    sector, type_of_stakeholder, location_country_region, primary_area_operation_agriculture,
    other_area_agriculture, primary_area_operation_forestry, other_area_forestry, organic_farming,
    organisation_size, regional_subsector_considerations, considerations, governance_model,
    regulatory_considerations, specify_regulatory, influenced_decision_making, impact_on_job_creation,
    economic_impact, sustainability_impact, energy_efficiency_impact, biodiversity_impact, track_sustainability,
    plans_for_expansion, facilitate_expansion, future_developments, additional_input
)
VALUES

('2024-08-01 08:00:00', '2024-08-01 09:00:00', 'Completed', '192.168.1.1', 100, 3600, true,
 '2024-08-01 09:00:00', 'resp1', 'Doe', 'John', 'john.doe@example.com', 'extRef1', '40.7128N', '74.0060W',
 'Online', 'EN', 'Agreed', true, 'John Doe', false, 'Org1', 'Agriculture', 'Farmer', 'USA',
 'Crops', 'Livestock', 'Forestry', 'Sustainable', true, 'Small', 'Subsector1', 'Consideration1',
 'Model1', 'Regulation1', 'Specific1', true, 'Impact1', 'Economic1', 'Sustainability1',
 'Energy1', 'Biodiversity1', 'Track1', 'Expansion1', 'Facilitate1', 'Developments1', 'Input1'),


('2024-08-02 08:00:00', '2024-08-02 09:00:00', 'In Progress', '192.168.1.2', 80, 3000, false,
 '2024-08-02 09:00:00', 'resp2', 'Smith', 'Jane', 'jane.smith@example.com', 'extRef2', '34.0522N', '118.2437W',
 'Offline', 'FR', 'Disagreed', false, 'Jane Smith', true, 'Org2', 'Forestry', 'Stakeholder', 'Canada',
 'Forestry', 'Logging', 'Crops', 'Organic', false, 'Large', 'Subsector2', 'Consideration2',
 'Model2', 'Regulation2', 'Specific2', false, 'Impact2', 'Economic2', 'Sustainability2',
 'Energy2', 'Biodiversity2', 'Track2', 'Expansion2', 'Facilitate2', 'Developments2', 'Input2'),


('2024-08-03 08:00:00', '2024-08-03 09:00:00', 'Pending', '192.168.1.3', 60, 2400, false,
 '2024-08-03 09:00:00', 'resp3', 'Brown', 'Alice', 'alice.brown@example.com', 'extRef3', '51.5074N', '0.1278W',
 'Mixed', 'DE', 'Agreed', true, 'Alice Brown', false, 'Org3', 'Farming', 'Advisor', 'Germany',
 'Livestock', 'Poultry', 'Forestry', 'Renewable', true, 'Medium', 'Subsector3', 'Consideration3',
 'Model3', 'Regulation3', 'Specific3', true, 'Impact3', 'Economic3', 'Sustainability3',
 'Energy3', 'Biodiversity3', 'Track3', 'Expansion3', 'Facilitate3', 'Developments3', 'Input3'),


('2024-08-31 08:00:00', '2024-08-31 09:00:00', 'Completed', '192.168.1.50', 100, 3600, true,
 '2024-08-31 09:00:00', 'resp50', 'Johnson', 'Emma', 'emma.johnson@example.com', 'extRef50', '37.7749N', '122.4194W',
 'Online', 'ES', 'Agreed', true, 'Emma Johnson', false, 'Org50', 'Agriculture', 'Consultant', 'Spain',
 'Crops', 'Horticulture', 'Forestry', 'Sustainable', true, 'Small', 'Subsector50', 'Consideration50',
 'Model50', 'Regulation50', 'Specific50', true, 'Impact50', 'Economic50', 'Sustainability50',
 'Energy50', 'Biodiversity50', 'Track50', 'Expansion50', 'Facilitate50', 'Developments50', 'Input50');
