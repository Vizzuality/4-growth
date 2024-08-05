import { SetMetadata } from '@nestjs/common';

/**
 * @description Decorator to inject a IS_PUBLIC_KEY metadata to the handler, which will be read by the JwtAuthGuard to allow public access to the handler.
 */

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
