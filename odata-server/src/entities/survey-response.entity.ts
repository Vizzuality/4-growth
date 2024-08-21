import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Edm } from 'odata-v4-server';

@Entity({ name: 'survey_responses' })
export class SurveyResponse {
  @PrimaryGeneratedColumn()
  @Edm.Int32
  id: number;

  @Column()
  @Edm.String
  org_4growth: string;

  @Column()
  @Edm.String
  sector_4growth: string;

  @Column()
  @Edm.String
  type: string;

  @Column()
  @Edm.String
  location: string;

  @Column()
  @Edm.String
  prim_agri: string;

  @Column({ nullable: true })
  @Edm.String
  prim_agri_other?: string;

  @Column()
  @Edm.String
  prim_forest: string;

  @Column({ nullable: true })
  @Edm.String
  prim_forest_other?: string;

  @Column()
  @Edm.String
  org_farm: string;

  @Column()
  @Edm.String
  org_size: string;

  @Column()
  @Edm.String
  reg_cons: string;

  @Column()
  @Edm.String
  considerations: string;

  @Column()
  @Edm.String
  gm01: string;

  @Column()
  @Edm.String
  gm02: string;

  @Column({ nullable: true })
  @Edm.String
  gm02_other?: string;

  @Column()
  @Edm.String
  gm04: string;

  @Column({ nullable: true })
  @Edm.String
  gm04_other?: string;

  @Column({ nullable: true })
  @Edm.String
  gm04_1?: string;

  @Column()
  @Edm.String
  integrated_digi_tech: string;

  @Column({nullable: true})
  @Edm.String
  digitech_agri: string;

  @Column({ nullable: true })
  @Edm.String
  digitech_agri_other?: string;

  @Column({ nullable: true })
  @Edm.String
  digitaltech_forestry?: string;

  @Column({ nullable: true })
  @Edm.String
  digitaltech_forestry_other?: string;

  @Column({type: 'boolean', default: false})
  @Edm.String
  goals_to_adopt: boolean;

  @Column({ nullable: true })
  @Edm.String
  specify_challenges_tech_adopt?: string;

  @Column()
  @Edm.String
  lvl_digitalisation: string;

  @Column()
  @Edm.String
  prim_function_tech: string;

  @Column()
  @Edm.String
  adopt_level_tech: string;

  @Column({ nullable: true })
  @Edm.String
  challenges_tech_adopt?: string;

  @Column({ nullable: true })
  @Edm.String
  specify_challenges?: string;

  @Column({type: 'boolean', default: false})
  @Edm.String
  further_integration: boolean;

  @Column({ nullable: true })
  @Edm.String
  specify_barriers?: string;

  @Column()
  @Edm.String
  digitech_userneeds: string;

  @Column({nullable: true})
  @Edm.String
  adv_tech: string;

  @Column({ nullable: true })
  @Edm.String
  adv_tech_other?: string;

  @Column({type: 'boolean', default: false, nullable: true})
  @Edm.String
  limitations_tech: boolean;

  @Column({ nullable: true })
  @Edm.String
  specify_limitations?: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  @Edm.String
  network_connect: string;

  @Column({ nullable: true })
  @Edm.String
  network_connectivity: string;

  @Column({ nullable: true })
  @Edm.String
  reliability_network: string;

  @Column({ nullable: true })
  @Edm.String
  barriers_connectivity?: string;

  @Column({ nullable: true })
  @Edm.String
  devices_network: string;

  @Column({ nullable: true })
  @Edm.String
  acp6_1: string;

  @Column({ nullable: true })
  @Edm.String
  acp6_1_other?: string;

  @Column({ nullable: true})
  @Edm.String
  acp6_2: string;

  @Column({ nullable: true })
  @Edm.String
  acp6_3: string;

  @Column({ nullable: true })
  @Edm.String
  acp6_4: string;

  @Column({ nullable: true })
  @Edm.String
  acp6_4_1?: string;

  @Column({ nullable: true })
  @Edm.String
  dmdsp7_1: string;

  @Column({ nullable: true})
  @Edm.String
  dmdsp7_2: string;

  @Column({ nullable: true })
  @Edm.String
  dmdsp7_3: string;

  @Column({ nullable: true})
  @Edm.String
  dmdsp7_4: string;

  @Column({ nullable: true })
  @Edm.String
  dmdsp7_5: string;

  @Column({ nullable: true})
  @Edm.String
  dmdsp7_6: string;

  @Column()
  @Edm.String
  dmdsp7_7: string;

  @Column({ nullable: true })
  @Edm.String
  dmdsp7_8: string;

  @Column({ nullable: true})
  @Edm.String
  dmdsp7_9: string;

  @Column({ nullable: true})
  @Edm.String
  dmdsp7_10: string;

  @Column({ nullable: true })
  @Edm.String
  dsdf8_1: string;

  @Column({ nullable: true})
  @Edm.String
  dsdf8_2: string;

  @Column({ nullable: true })
  @Edm.String
  dsdf8_1_1?: string;

  @Column({ nullable: true })
  @Edm.String
  dsdf8_1_2?: string;

  @Column({ nullable: true })
  @Edm.String
  dsdf8_3: string;

  @Column({ nullable: true })
  @Edm.String
  dsdf8_4: string;

  @Column({ nullable: true })
  @Edm.String
  dsdf8_4_1?: string;

  @Column({ nullable: true })
  @Edm.String
  dsdf8_5: string;

  @Column({ nullable: true })
  @Edm.String
  dsdf8_6: string;

  @Column()
  @Edm.String
  dsdf8_7: string;

  @Column()
  @Edm.String
  dsdf8_8: string;

  @Column()
  @Edm.String
  dsdf8_9: string;

  @Column({ nullable: true })
  @Edm.String
  dsdf8_9_1?: string;

  @Column()
  @Edm.String
  dsdf8_10: string;

  @Column()
  @Edm.String
  digitech_social_benefits: string;

  @Column()
  @Edm.String
  digitech_job_creation: string;

  @Column()
  @Edm.String
  digitech_overall_social: string;

  @Column()
  @Edm.String
  digitech_efficiency: string;

  @Column()
  @Edm.String
  digitech_input: string;

  @Column()
  @Edm.String
  digitech_overall_economic: string;

  @Column()
  @Edm.String
  digitech_sustainability: string;

  @Column()
  @Edm.String
  digitech_impacts_footprint: string;

  @Column()
  @Edm.String
  didgitech_energy_efficiency: string;

  @Column()
  @Edm.String
  digitech_biodiversity: string;

  @Column()
  @Edm.String
  digitech_track_sustainability: string;

  @Column()
  @Edm.String
  plan_upgrade_digitech: string;

  @Column()
  @Edm.String
  facilitate_expansion_upgrade: string;

  @Column()
  @Edm.String
  type_of_developments: string;

  @Column({ nullable: true })
  @Edm.String
  ac12_1: string;
}
