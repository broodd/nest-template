import { randomBytes, scrypt as scryptCallback, timingSafeEqual, BinaryLike } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify<BinaryLike, BinaryLike, number, Buffer>(scryptCallback);
const saltRounds = 10;
const keyLength = 64;

/**
 * [description]
 * @param password
 */
export const hash = async (password: string): Promise<string> => {
  const salt = randomBytes(saltRounds).toString('hex');
  const derivedKey = await scrypt(password, salt, keyLength);
  return salt + ':' + derivedKey.toString('hex');
};

/**
 * [description]
 * @param password
 * @param encrypted
 */
export const compare = async (password: string, encrypted: string): Promise<boolean> => {
  const [salt, key] = encrypted.split(':');
  const keyBuffer = Buffer.from(key, 'hex');
  const derivedKey = await scrypt(password, salt, keyLength);
  return timingSafeEqual(keyBuffer, derivedKey);
};
