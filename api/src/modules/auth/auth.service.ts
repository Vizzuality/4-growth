import { Injectable } from '@nestjs/common';
import { UsersService } from '@api/modules/users/users.service';
import { SignUpDto } from '@shared/dto/auth/sign-up.dto';
import { CryptService } from '@api/modules/auth/crypt/crypt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly crypto: CryptService,
  ) {}

  async signUp(dto: SignUpDto): Promise<void> {
    const passwordHash = await this.crypto.hashPassword(dto.password);
    await this.usersService.createUser({
      email: dto.email,
      password: passwordHash,
      username: dto.username,
    });
  }
}
