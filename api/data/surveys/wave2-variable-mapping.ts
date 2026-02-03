/**
 * Wave 2 Variable to Question Text Mapping
 *
 * This mapping normalizes Wave 2 OData variable names (column names) to their
 * corresponding question text. For questions that exist in both waves, we use
 * the Wave 1 question text to ensure both waves share the same indicator and
 * their data is combined in all queries.
 *
 * Categories:
 * - Shared questions: Normalize to W1 text so both waves share the same indicator
 * - Rephrased questions: W2 rephrased version, normalize to W1 text for same indicator
 * - New W2 questions: New question text for new indicators
 */
export const WAVE2_VARIABLE_TO_QUESTION: Record<string, string> = {
  // Shared questions - normalize to W1 text so both waves share the same indicator
  Sector_AgriForestryBoth: 'Sector (agri/forestry/both)',
  Type_of_stakeholder: 'Type of stakeholder',
  Location_CountryRegion: 'Location (country/region)',
  AgricultureForestry_organization_size:
    'Agriculture/forestry organisation size',
  Primary_Area_of_Operation_in_forestry:
    'Primary area of operation in forestry',
  Has_your_organisation_integrated_digital_technologies_into_its_workflows:
    'Has your organisation integrated digital technologies into its workflows?',
  What_type_of_digital_technology_has_been_used_for_agriculture:
    'What type of digital technology has been used for agriculture?',
  What_type_of_digital_technology_has_been_used_for_forestry:
    'What type of digital technology has been used for forestry?',
  What_are_the_primary_functions_of_these_technologies_in_the_agriculture_or_forestry_value_chain:
    'What are the primary functions of these technologies in the agriculture or forestry value chain?',
  Are_there_specific_barriers_hindering_further_integration:
    'Are there specific barriers hindering further integration?',
  Do_you_have_network_connectivity: 'Do you have network connectivity?',
  What_network_connectivity_do_you_use: 'What network connectivity do you use?',
  How_reliable_is_the_current_network_connectivity_1_being_not_reliable_5_being_very_reliable:
    'How reliable is the current network connectivity? (1 being not reliable, 5 being very reliable)',
  Do_you_pay_for_this_data: 'Do you pay for this data?',
  What_type_of_data_do_you_collect: 'What type of data do you collect?',
  What_type_of_tools_or_platforms_do_you_use_to_collect_data:
    'What type of tools or platforms do you use to collect data?',
  Where_and_how_do_you_store_this_data: 'Where and how do you store this data?',

  // Rephrased questions - normalize to W1 text for same indicator
  Do_you_share_the_data_you_have_collected_with_others:
    'Do you share this data?',
  Digital_technologies_have_resulted_in_cost_savings_or_increased_efficiency_in_our_operations:
    'Have digital technologies resulted in cost savings or increased efficiency?',
  Digital_technologies_have_positively_contributed_to_sustainability_and_environmental_practices_in_our_organization:
    'Have digital technologies contributed to sustainability and environmental practices?',
  Our_organization_plans_to_expand_or_upgrade_its_current_digital_infrastructure_in_the_near_future:
    'Are there plans to expand or upgrade your current digital infrastructure?',

  // New W2 questions - new question text for new indicators
  What_type_of_organisation_are_you: 'What type of organisation are you?',
  What_is_the_geographical_reach_of_the_services_that_you_offer:
    'What is the geographical reach of the services that you offer?',
  Would_you_further_adopt_digital_technologies_if_you_had_better_network_connectivity:
    'Would you further adopt digital technologies if you had better network connectivity?',
  Would_you_be_able_to_operate_without_this_data:
    'Would you be able to operate without this data?',
  To_who_and_where_do_you_send_this_data:
    'To whom and where do you send this data?',

  // Tech provider questions
  What_percentage_of_your_products_or_services_are_specifically_targeted_at_the_agricultural_and_forestry_sectors:
    'What percentage of your products or services are specifically targeted at the agricultural and forestry sectors?',
  What_sales_model_do_you_primarily_use_for_your_productsservices:
    'What sales model do you primarily use for your products/services?',
  What_type_of_users_do_you_primarily_provide_your_technology_to:
    'What type of users do you primarily provide your technology to?',
  What_types_of_data_do_your_products_or_services_generate_or_rely_on:
    'What types of data do your products or services generate or rely on?',

  // Associated costs / prerequisites (tech provider focus)
  Can_you_provide_insights_into_the_cost_structure_associated_with_implementing_and_maintaining_your_technology:
    'Can you provide insights into the cost structure associated with implementing and maintaining your technology?',
  Do_you_conduct_market_research_or_needs_assessments_before_developing_digital_solutions_for_agriculture_and_forestry:
    'Do you conduct market research or needs assessments before developing digital solutions for agriculture and forestry?',
  Do_you_employ_specific_strategies_to_penetrate_diverse_markets_within_agriculture_and_forestry:
    'Do you employ specific strategies to penetrate diverse markets within agriculture and forestry?',
  Do_you_offer_any_aftersales_service_support_or_warranty_for_your_products_or_services:
    'Do you offer any after-sales service, support, or warranty for your products or services?',
  Do_you_prioritize_user_needs_within_the_agricultural_and_forestry_sectors_during_the_development_phase:
    'Do you prioritize user needs within the agricultural and forestry sectors during the development phase?',
};

export const MAPPED_VARIABLES = Object.keys(WAVE2_VARIABLE_TO_QUESTION);

export function hasQuestionMapping(variable: string): boolean {
  return variable in WAVE2_VARIABLE_TO_QUESTION;
}

export function getQuestionText(variable: string): string | undefined {
  return WAVE2_VARIABLE_TO_QUESTION[variable];
}
