import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Edm } from 'odata-v4-server';

@Entity('survey_responses')
export class SurveyResponse {
  @PrimaryGeneratedColumn()
  @Edm.Int32
  id: number;

  @Column({ type: 'timestamp' })
  @Edm.DateTimeOffset
  startDate: Date;

  @Column({ type: 'timestamp' })
  @Edm.DateTimeOffset
  endDate: Date;

  @Column({ type: 'varchar', length: 255 })
  @Edm.String
  status: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  ipAddress: string;

  @Column({ type: 'int' })
  @Edm.Int32
  progress: number;

  @Column({ type: 'int' })
  @Edm.Int32
  durationInSeconds: number;

  @Column({ type: 'boolean' })
  @Edm.Boolean
  finished: boolean;

  @Column({ type: 'timestamp' })
  @Edm.DateTimeOffset
  recordedDate: Date;

  @Column({ type: 'varchar', length: 255 })
  @Edm.String
  responseId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  recipientLastName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  recipientFirstName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  recipientEmail: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  externalDataReference: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  locationLatitude: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  locationLongitude: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  distributionChannel: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  userLanguage: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  consentStatement: string;

  @Column({ type: 'boolean', nullable: true })
  @Edm.Boolean
  agreeToContact: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  name: string;

  @Column({ type: 'boolean', nullable: true })
  @Edm.Boolean
  testEntry: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  organisationName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  sector: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  typeOfStakeholder: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  locationCountryRegion: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  primaryAreaOperationAgriculture: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  otherAreaAgriculture: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  primaryAreaOperationForestry: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  otherAreaForestry: string;

  @Column({ type: 'boolean', nullable: true })
  @Edm.Boolean
  organicFarming: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Edm.String
  organisationSize: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  regionalSubsectorConsiderations: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  considerations: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  governanceModel: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  regulatoryConsiderations: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  specifyRegulatory: string;

  @Column({ type: 'boolean', nullable: true })
  @Edm.Boolean
  influencedDecisionMaking: boolean;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  impactOnJobCreation: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  economicImpact: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  sustainabilityImpact: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  energyEfficiencyImpact: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  biodiversityImpact: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  trackSustainability: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  plansForExpansion: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  facilitateExpansion: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  futureDevelopments: string;

  @Column({ type: 'text', nullable: true })
  @Edm.String
  additionalInput: string;
}
