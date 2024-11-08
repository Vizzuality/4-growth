import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const AUTHORIZATION_CHECKS = 'AUTHORIZATION_CHECKS';

export enum AUTHORIZATION_STRATEGIES {
  USER_ID_PARAM = 0,
}

const reflector = new Reflector();

export const AuthorizeByUserIdParam = () => {
  return (target: object, key?: any, descriptor?: any) => {
    const authorizationChecks =
      reflector.get<number[]>(AUTHORIZATION_CHECKS, target[key]) ?? [];

    authorizationChecks.push(AUTHORIZATION_STRATEGIES.USER_ID_PARAM);

    SetMetadata(AUTHORIZATION_CHECKS, authorizationChecks)(
      target,
      key,
      descriptor,
    );
  };
};
