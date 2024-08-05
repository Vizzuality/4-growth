import { UserDto } from '@shared/dto/users/user.dto';

export interface IAccessToken {
  user: UserDto;
  accessToken: string;
}
