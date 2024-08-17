import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('survey_responses')
export class SurveyResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'varchar', length: 255 })
  status: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ipAddress: string;

  @Column({ type: 'int' })
  progress: number;

  @Column({ type: 'int' })
  durationInSeconds: number;

  @Column({ type: 'boolean' })
  finished: boolean;

  @Column({ type: 'timestamp' })
  recordedDate: Date;

  @Column({ type: 'varchar', length: 255 })
  responseId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  recipientLastName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  recipientFirstName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  recipientEmail: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  externalDataReference: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  locationLatitude: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  locationLongitude: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  distributionChannel: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userLanguage: string;

  @Column({ type: 'text', nullable: true })
  consentStatement: string;

  @Column({ type: 'boolean', nullable: true })
  agreeToContact: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'boolean', nullable: true })
  testEntry: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  organisationName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sector: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  typeOfStakeholder: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  locationCountryRegion: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  primaryAreaOperationAgriculture: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  otherAreaAgriculture: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  primaryAreaOperationForestry: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  otherAreaForestry: string;

  @Column({ type: 'boolean', nullable: true })
  organicFarming: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  organisationSize: string;

  @Column({ type: 'text', nullable: true })
  regionalSubsectorConsiderations: string;

  @Column({ type: 'text', nullable: true })
  considerations: string;

  @Column({ type: 'text', nullable: true })
  governanceModel: string;

  @Column({ type: 'text', nullable: true })
  regulatoryConsiderations: string;

  @Column({ type: 'text', nullable: true })
  specifyRegulatory: string;

  @Column({ type: 'boolean', nullable: true })
  influencedDecisionMaking: boolean;

  @Column({ type: 'text', nullable: true })
  impactOnJobCreation: string;

  @Column({ type: 'text', nullable: true })
  economicImpact: string;

  @Column({ type: 'text', nullable: true })
  sustainabilityImpact: string;

  @Column({ type: 'text', nullable: true })
  energyEfficiencyImpact: string;

  @Column({ type: 'text', nullable: true })
  biodiversityImpact: string;

  @Column({ type: 'text', nullable: true })
  trackSustainability: string;

  @Column({ type: 'text', nullable: true })
  plansForExpansion: string;

  @Column({ type: 'text', nullable: true })
  facilitateExpansion: string;

  @Column({ type: 'text', nullable: true })
  futureDevelopments: string;

  @Column({ type: 'text', nullable: true })
  additionalInput: string;
}
