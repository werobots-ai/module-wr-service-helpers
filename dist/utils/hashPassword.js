"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
const crypto_1 = require("crypto");
const SALT_LENGTH = 16; // Define the length of the per-password salt in bytes
const HASH_LENGTH = 64; // Define the output length of the hashed password in bytes
/**
 * Hashes a password with a per-password salt and an optional environment-based salt.
 * @param password - The plain text password to be hashed.
 * @param saltFromEnv - Optional environment-based salt for added security.
 * @returns The resulting hashed password in the format "salt:hash".
 */
function hashPassword(password, saltFromEnv) {
    if (!password)
        throw new Error("Password must be provided");
    // Generate a unique per-password salt
    const userSalt = (0, crypto_1.randomBytes)(SALT_LENGTH).toString("hex");
    // Combine with environment salt if provided
    const combinedSalt = saltFromEnv ? userSalt + saltFromEnv : userSalt;
    // Hash the password with the combined salt
    const hash = (0, crypto_1.scryptSync)(password, combinedSalt, HASH_LENGTH).toString("hex");
    return `${userSalt}:${hash}`; // Return per-password salt and hash
}
/**
 * Verifies if a plain text password matches the stored hash, using a per-password salt
 * and an optional environment-based salt if the password was encoded with one.
 * @param password - The plain text password to verify.
 * @param hash - The stored hash formatted as "salt:hash".
 * @param saltFromEnv - Optional environment-based salt to match the encoding salt.
 * @returns True if the password matches the hash, otherwise false.
 */
function verifyPassword(password, hash, saltFromEnv) {
    const [userSalt, storedHash] = hash.split(":");
    // Recombine the per-password and environment salt if provided
    const combinedSalt = saltFromEnv ? userSalt + saltFromEnv : userSalt;
    // Hash the input password with the combined salt
    const derivedHash = (0, crypto_1.scryptSync)(password, combinedSalt, HASH_LENGTH);
    const originalHash = Buffer.from(storedHash, "hex");
    return (0, crypto_1.timingSafeEqual)(derivedHash, originalHash);
}
