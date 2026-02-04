import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";
import { Buffer } from "node:buffer";

/**
 * Hashes a password using scrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64);
  const hash = `${salt}:${derivedKey.toString("hex")}`;
  console.log("hashPassword: created hash for email", { salt, hashLength: hash.length });
  return hash;
}

/**
 * Verifies a password against a hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    if (!hash || !hash.includes(":")) {
      console.log("verifyPassword: hash invalid format or legacy", { hash });
      return false;
    }
    const [salt, keyHex] = hash.split(":");
    const key = Buffer.from(keyHex, "hex");
    const derivedKey = scryptSync(password, salt, 64);

    // timingSafeEqual requires same length
    if (derivedKey.length !== key.length) {
      console.log("verifyPassword: length mismatch", { derivedLength: derivedKey.length, keyLength: key.length });
      return false;
    }

    return timingSafeEqual(derivedKey, key);
  } catch (error) {
    console.error("verifyPassword error:", error);
    return false;
  }
}

/**
 * Generates a secure random token with a prefix.
 */
export function generateSecureToken(prefix: string = 'mg', length: number = 32): string {
  const randomPart = randomBytes(length).toString('hex');
  return `${prefix}_${randomPart}`;
}