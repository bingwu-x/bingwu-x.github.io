import crypto from 'node:crypto';

export interface EncryptedPayload {
  salt: string;          // base64
  iv: string;            // base64
  ciphertext: string;    // base64 (includes auth tag)
  iterations: number;
}

const ITERATIONS = 600_000; // high enough to slow down brute-force
const KEY_LENGTH = 32;      // 256 bit
const IV_LENGTH = 12;       // recommended for GCM
const SALT_LENGTH = 16;

/**
 * Encrypt plain text with a password using AES-256-GCM + PBKDF2
 */
export function encrypt(plainText: string, password: string): EncryptedPayload {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);

  // Derive a strong key from the password
  const key = crypto.pbkdf2Sync(
    password,
    salt,
    ITERATIONS,
    KEY_LENGTH,
    'sha256'
  );

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plainText, 'utf8'),
    cipher.final(),
  ]);

  // GCM authentication tag (prevents tampering)
  const authTag = cipher.getAuthTag();

  // Combine ciphertext + authTag
  const combined = Buffer.concat([encrypted, authTag]);

  return {
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    ciphertext: combined.toString('base64'),
    iterations: ITERATIONS,
  };
}