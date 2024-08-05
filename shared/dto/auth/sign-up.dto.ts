import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { z } from 'zod';
import { SignUpSchema } from '@shared/schemas/auth.schemas';

export class SignUpDtoBack {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password!: string;
}

// TODO: We might want to create types just in the api based on the zod schemas, but not sure. maybe types are useful for FE

export type SignUpDto = z.infer<typeof SignUpSchema>;
