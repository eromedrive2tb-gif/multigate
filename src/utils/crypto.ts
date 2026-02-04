import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Hashes a password using scrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Verifies a password against a hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, key] = hash.split(":");
  const derivedKey = scryptSync(password, salt, 64);
  return timingSafeEqual(derivedKey, Buffer.from(key, "hex"));
}

/**
 * Generates a secure random token with a prefix.
 */
export function generateSecureToken(prefix: string = 'mg', length: number = 32): string {
  const randomPart = randomBytes(length).toString('hex');
  return `${prefix}_${randomPart}`;
}