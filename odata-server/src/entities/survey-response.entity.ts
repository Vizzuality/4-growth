import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Edm } from 'odata-v4-server';

// TODO: Fields coming from the DB must match the properties decorated with Odata to be serialized. Handle this scenario

@Entity('survey_responses')
export class SurveyResponse {
  @PrimaryGeneratedColumn()
  @Edm.Int32
  id: number;

  @Column({ type: 'timestamp' })
  @Edm.DateTimeOffset
  start_date: Date;

  @Column({ type: 'timestamp' })
  @Edm.DateTimeOffset
  end_date: Date;

  @Column({ type: 'varchar', length: 255 })
  @Edm.String
  status: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  ip_address: string;

  @Column({ type: 'int' })
  @Edm.Int32
  progress: number;

  @Column({ type: 'int' })
  @Edm.Int32
  duration_in_seconds: number;

  @Column({ type: 'boolean' })
  @Edm.Boolean
  finished: boolean;

  @Column({ type: 'timestamp' })
  @Edm.DateTimeOffset
  recorded_date: Date;

  @Column({ type: 'varchar', length: 255 })
  @Edm.String
  response_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  recipient_last_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  recipient_first_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  recipient_email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  external_data_reference: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  location_latitude: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  location_longitude: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  distribution_channel: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  user_language: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  consent_statement: string;

  @Column({ type: 'boolean', nullable: true })
  @Edm.Boolean
  agree_to_contact: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  name: string;

  @Column({ type: 'boolean', nullable: true })
  @Edm.Boolean
  test_entry: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  organisation_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  sector: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  type_of_stakeholder: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  location_country_region: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  primary_area_operation_agriculture: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  other_area_agriculture: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  primary_area_operation_forestry: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  other_area_forestry: string;

  @Column({ type: 'boolean', nullable: true })
  @Edm.Boolean
  organic_farming: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  organisation_size: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  regional_subsector_considerations: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  considerations: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  governance_model: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  regulatory_considerations: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  specify_regulatory: string;

  @Column({ type: 'boolean', nullable: true })
  @Edm.Boolean
  influenced_decision_making: boolean;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  impact_on_job_creation: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  economic_impact: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  sustainability_impact: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  energy_efficiency_impact: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  biodiversity_impact: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  track_sustainability: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  plans_for_expansion: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  facilitate_expansion: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  future_developments: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  additional_input: string;
}
