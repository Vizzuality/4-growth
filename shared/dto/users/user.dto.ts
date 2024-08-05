import { User } from '@shared/dto/users/user.entity';
import { OmitType } from '@nestjs/mapped-types';

export class UserDto extends OmitType(User, ['password']) {}
