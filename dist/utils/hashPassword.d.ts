/**
 * Hashes a password with a per-password salt and an optional environment-based salt.
 * @param password - The plain text password to be hashed.
 * @param saltFromEnv - Optional environment-based salt for added security.
 * @returns The resulting hashed password in the format "salt:hash".
 */
export declare function hashPassword(password: string, saltFromEnv?: string): string;
/**
 * Verifies if a plain text password matches the stored hash, using a per-password salt
 * and an optional environment-based salt if the password was encoded with one.
 * @param password - The plain text password to verify.
 * @param hash - The stored hash formatted as "salt:hash".
 * @param saltFromEnv - Optional environment-based salt to match the encoding salt.
 * @returns True if the password matches the hash, otherwise false.
 */
export declare function verifyPassword(password: string, hash: string, saltFromEnv?: string): boolean;
