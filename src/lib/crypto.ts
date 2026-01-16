import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 12 bytes for GCM
const AUTH_TAG_LENGTH = 16; // 16 bytes for GCM
const KEY_LENGTH = 32; // 32 bytes for AES-256

/**
 * Retrieves and validates the encryption key from environment variables.
 * Expects a 32-byte hex-encoded key.
 * @returns {Buffer} The validated encryption key as a Buffer
 * @throws {Error} If the key is not set or is not 32 bytes
 */
function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }
  
  // Handle both hex and base64 encoded keys for backwards compatibility
  let keyBuffer: Buffer;
  if (key.length === 64 && /^[a-fA-F0-9]+$/.test(key)) {
    // Hex encoded 32-byte key
    keyBuffer = Buffer.from(key, 'hex');
  } else {
    // Fall back to base64 for backwards compatibility
    keyBuffer = Buffer.from(key, 'base64');
  }
  
  if (keyBuffer.length !== KEY_LENGTH) {
    throw new Error(`ENCRYPTION_KEY must be ${KEY_LENGTH} bytes (32 bytes, hex or Base64 encoded)`);
  }
  return keyBuffer;
}

/**
 * Encrypts plain text using AES-256-GCM authenticated encryption.
 * @param {string} text - The plain text to encrypt
 * @returns {string} The encrypted text in format `iv:authTag:encryptedContent` (hex encoded)
 * @throws {Error} If encryption fails
 */
export function encrypt(text: string): string {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid input: text must be a non-empty string');
  }

  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts encrypted text using AES-256-GCM authenticated encryption.
 * @param {string} encryptedText - The encrypted text in format `iv:authTag:encryptedContent` (hex encoded)
 * @returns {string} The decrypted plain text
 * @throws {Error} If the encrypted text format is invalid or decryption fails
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText || typeof encryptedText !== 'string') {
    throw new Error('Invalid input: encryptedText must be a non-empty string');
  }

  const key = getKey();
  const parts = encryptedText.split(':');

  if (parts.length !== 3) {
    throw new Error('Invalid encrypted text format: expected iv:authTag:encryptedContent');
  }

  const [ivHex, authTagHex, encryptedHex] = parts;
  
  // Validate hex strings
  if (!/^[a-fA-F0-9]+$/.test(ivHex) || ivHex.length !== IV_LENGTH * 2) {
    throw new Error('Invalid IV format');
  }
  if (!/^[a-fA-F0-9]+$/.test(authTagHex) || authTagHex.length !== AUTH_TAG_LENGTH * 2) {
    throw new Error('Invalid auth tag format');
  }
  if (!/^[a-fA-F0-9]+$/.test(encryptedHex)) {
    throw new Error('Invalid encrypted content format');
  }

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted;
  try {
    decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
  } catch (error) {
    throw new Error('Decryption failed: authentication tag mismatch or corrupted data');
  }

  return decrypted.toString('utf8');
}

/**
 * Generates a random 32-byte encryption key, hex encoded for use in .env files.
 * @returns {string} A hex encoded 32-byte random key
 */
export function generateKey(): string {
  return crypto.randomBytes(KEY_LENGTH).toString('hex');
}

/**
 * Checks if a value is already encrypted by checking for the encryption format.
 * Encrypted values have the format `iv:authTag:encryptedContent` (hex encoded).
 * @param {string} value - The value to check
 * @returns {boolean} True if the value appears to be encrypted
 */
export function isEncrypted(value: string): boolean {
  if (!value || typeof value !== 'string') {
    return false;
  }
  
  const parts = value.split(':');
  if (parts.length !== 3) {
    return false;
  }
  
  const [ivHex, authTagHex] = parts;
  
  // Validate hex format and expected lengths
  return (
    /^[a-fA-F0-9]+$/.test(ivHex) &&
    ivHex.length === IV_LENGTH * 2 &&
    /^[a-fA-F0-9]+$/.test(authTagHex) &&
    authTagHex.length === AUTH_TAG_LENGTH * 2
  );
}

/**
 * Safely decrypts a value if it's encrypted, otherwise returns the value as-is.
 * This is useful for handling backward compatibility with unencrypted data.
 * @param {string} value - The value to potentially decrypt
 * @returns {string} The decrypted value if encrypted, or the original value
 */
export function safeDecrypt(value: string): string {
  if (!value || typeof value !== 'string') {
    return value;
  }
  
  if (isEncrypted(value)) {
    return decrypt(value);
  }
  
  return value;
}
