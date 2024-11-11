import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '@api/modules/users/users.service';
import { SignUpDto } from '@shared/dto/auth/sign-up.dto';
import { PasswordService } from '@api/modules/auth/password/password.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '@api/modules/auth/jwt-payload.interface';
import { IAccessToken } from '@shared/dto/auth/access-token.interface';
import { UpdateUserPasswordDto } from '@shared/dto/users/update-user-password.dto';
import { User } from '@shared/dto/users/user.entity';
import {
  PasswordRecovery,
  PasswordRecoveryEmailService,
} from '@api/modules/auth/password/password-recovery-email.service';
import { AppConfig } from '@api/utils/app-config';
import { ApiEventsService } from '@api/modules/api-events/api-events.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: Logger,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly passwordMailer: PasswordRecoveryEmailService,
    private readonly jwtService: JwtService,
    private readonly events: ApiEventsService,
  ) {}

  async signUp(dto: SignUpDto): Promise<void> {
    const passwordHash = await this.passwordService.hashPassword(dto.password);
    const user = await this.usersService.createUser({
      email: dto.email,
      password: passwordHash,
    });
    await this.events.createEvent(
      this.events.eventMap.USER_EVENTS.USER_SIGNED_UP,
      { associatedId: user.id },
    );
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
    return { user, accessToken };
  }

  async updatePassword(user: User, dto: UpdateUserPasswordDto): Promise<User> {
    const isPasswordValid = await this.passwordService.comparePassword(
      dto.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    user.password = await this.passwordService.hashPassword(dto.newPassword);
    return this.usersService.update(user.id, user);
  }

  async recoverPassword(
    passwordRecovery: Partial<PasswordRecovery>,
  ): Promise<void> {
    const user = await this.usersService.findByEmail(passwordRecovery.email);
    if (!user) {
      this.logger.warn(
        `User with email ${passwordRecovery.email} not found when trying to recover password`,
        this.constructor.name,
      );
      // if user does not exist, we should not return anything
      await this.events.createEvent(
        this.events.eventMap.USER_EVENTS.USER_NOT_FOUND_FOR_PASSWORD_RECOVERY,
        { data: { email: passwordRecovery.email } },
      );
      return;
    }
    const payload: JwtPayload = { id: user.id };
    const { passwordRecoveryExpiresIn } = AppConfig.getJWTConfig();
    const token = this.jwtService.sign(payload, {
      expiresIn: passwordRecoveryExpiresIn,
    });
    await this.passwordMailer.sendPasswordRecoveryEmail({
      email: passwordRecovery.email,
      url: passwordRecovery.url,
      token,
    });
    await this.events.createEvent(
      this.events.eventMap.USER_EVENTS.USER_REQUESTED_PASSWORD_RECOVERY,
      { associatedId: user.id },
    );
  }
}
