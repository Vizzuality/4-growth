import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCountryDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  iso: string;
}
