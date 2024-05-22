import {
  Column,
  CreateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@shared/dto/users/user.entity';

export class Country {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToMany(() => User, (user) => user.country)
  users: User[];

  @Column()
  name: string;

  @Column()
  iso: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
