import { IsString } from 'class-validator';

export class UpdateCustomChartDto {
  @IsString()
  name: string;
}
