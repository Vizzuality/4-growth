import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { User } from '../users/user.entity';

export class CreateCountryDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  iso: string;

  users: User[];

  @IsNotEmpty()
  createdAt: Date;
  @IsNotEmpty()
  updatedAt: Date;
}
