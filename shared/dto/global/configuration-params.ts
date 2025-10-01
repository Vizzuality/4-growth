import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('configuration_params')
export class ConfigurationParams {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  param: string;

  @Column({ type: 'varchar', length: 255 })
  value: string;
}
