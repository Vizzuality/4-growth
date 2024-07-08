import { InfoDTO } from 'nestjs-base-service';
import { User } from '@shared/dto/users/user.entity';

export type AppInfoDTO = InfoDTO<User>;
