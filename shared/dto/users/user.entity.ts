import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Country } from '@shared/dto/countries/country.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Country, (country) => country.users)
  country: Country;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
