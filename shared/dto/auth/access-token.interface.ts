import { User } from '@shared/dto/users/user.entity';

export interface IAccessToken {
  user: Partial<User>;
  accessToken: string;
}
