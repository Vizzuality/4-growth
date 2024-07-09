import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@api/modules/users/users.service';
import { SignUpDto } from '@shared/dto/auth/sign-up.dto';
import { PasswordService } from '@api/modules/auth/password/password.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '@api/modules/auth/jwt-payload.interface';
import { IAccessToken } from '@shared/dto/auth/access-token.interface';
import { UpdateUserPasswordDto } from '@shared/dto/users/update-user-password.dto';
import { User } from '@shared/dto/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(dto: SignUpDto): Promise<void> {
    const passwordHash = await this.passwordService.hashPassword(dto.password);
    await this.usersService.createUser({
      email: dto.email,
      password: passwordHash,
    });
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (
      user &&
      (await this.passwordService.comparePassword(password, user.password))
    ) {
      return user;
    }
    throw new UnauthorizedException(`Invalid credentials`);
  }

  async signIn(user: User): Promise<IAccessToken> {
    const payload: JwtPayload = { id: user.id };
    const accessToken: string = this.jwtService.sign(payload);
    const { password, ...userWithoutPassword } = user;
    return { user: { ...userWithoutPassword }, accessToken };
  }

  async updatePassword(
    userid: string,
    dto: UpdateUserPasswordDto,
  ): Promise<User> {
    const user = await this.usersService.findOneBy(userid);
    const isPasswordValid = await this.passwordService.comparePassword(
      dto.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    const newPasswordHash = await this.passwordService.hashPassword(
      dto.newPassword,
    );
    user.password = newPasswordHash;
    return this.usersService.update(userid, user);
  }
}
