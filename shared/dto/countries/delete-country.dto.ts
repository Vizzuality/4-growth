import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteCountryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  iso: string;
}
