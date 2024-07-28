import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { API_EVENT_TYPES } from '@shared/dto/api-events/api-event.types';

// TODO: create appropriate indexes for generating views later on

@Entity({ name: 'api_events' })
export class ApiEventEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('timestamp', { default: () => 'now()' })
  timestamp!: Date;

  // Type of event, providing a brief description of the event.
  @Column({ type: 'varchar', enum: API_EVENT_TYPES })
  type!: API_EVENT_TYPES;

  // Id of the resource associated with the event.
  @Column({ type: 'uuid', nullable: true })
  associatedId: string;

  // Payload of the event
  @Column({ type: 'jsonb', nullable: true })
  data: Record<string, unknown>;
}
