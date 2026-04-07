import crypto from 'crypto';

/**
 * Generates a SHA256 hash for a given string or buffer.
 * @param {crypto.BinaryLike} data - The data to hash.
 * @returns {string} - The hex representation of the SHA256 hash.
 */
export const createHash = (data: crypto.BinaryLike): string => {
  return crypto.createHash('sha256').update(data).digest('hex');
};
