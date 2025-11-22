import { LimitAttemptsOptions } from 'src/common/decorators';

/**
 * [description]
 */
export const CACHE_AUTH_PREFIX = 'AUTH:';
/**
 * [description]
 */
export const CACHE_LIMIT_PREFIX = 'ATTEMPTS:';

/**
 * Min 8 characters
 * Max 64 characters
 * Min 1 uppercase letter
 * Min 1 lowercase letter
 */
export const AUTH_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z]).{8,64}$/;

/**
 * Min 8 characters
 * Max 64 characters
 * Must contain at least one special character (!@#$%^&*)
 */
// export const AUTH_PASSWORD_REGEX = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,64}$/;

/**
 * For generate password by regex
 */
export const AUTH_PASSWORD_REGEX_GENERATOR = /([A-Z][a-z][0-9]{2,3}){2}/;

/**
 * Configs for limit attemtps
 */
export const LIMIT_ATTEMPTS_CONFIG: Record<string, LimitAttemptsOptions> = {
  signin: {
    maxAttempts: 10,
    ttlSeconds: 60,
    name: 'signin',
  },
};
