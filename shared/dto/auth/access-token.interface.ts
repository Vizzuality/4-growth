import { User } from '@shared/dto/users/user.entity';

export interface IAccessToken {
  user: Omit<User, 'password'>;
  accessToken: string;
}
