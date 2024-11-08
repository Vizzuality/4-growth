import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator';
import {
  AUTHORIZATION_CHECKS,
  AUTHORIZATION_STRATEGIES,
} from '@api/decorators/authorize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic: boolean = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, ctx: ExecutionContext): any {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    const authorizationChecks = this.reflector.get<number[]>(
      AUTHORIZATION_CHECKS,
      ctx.getHandler(),
    );
    // If authorizationChecks exists, it should an array. This is more performant that Array.isArray().
    if (authorizationChecks === undefined) return user;

    for (let idx = 0; idx < authorizationChecks.length; idx++) {
      const strategy = authorizationChecks[idx];
      if (strategy === AUTHORIZATION_STRATEGIES.USER_ID_PARAM) {
        const userId = ctx.switchToHttp().getRequest().params.userId;
        if (userId === user.id) {
          return user;
        }
      }
    }

    throw new ForbiddenException();
  }
}
