import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCountryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  iso: string;
}
