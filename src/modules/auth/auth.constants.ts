/**
 * [description]
 */
export const CACHE_AUTH_PREFIX = 'AUTH:';

/**
 * Min 8 characters
 * Max 64 characters
 * Min 1 number
 * Min 1 uppercase letter
 * Min 1 lowercase letter
 */
export const AUTH_PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,64}$/;

/**
 * For generate password by regex
 */
export const AUTH_PASSWORD_REGEX_GENERATOR = /([A-Z][a-z][0-9]{2,3}){2}/;
