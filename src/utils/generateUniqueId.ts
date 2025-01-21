import { randomBytes, createHash } from "crypto";

const byteToHex: string[] = Array.from({ length: 256 }, (_, i) =>
  i.toString(16).padStart(2, "0")
);

export const generateUuidV4 = (optionalInput?: string): string => {
  const bytes = optionalInput
    ? // Hash the input using SHA-256 for better uniqueness
      createHash("sha256").update(optionalInput).digest()
    : // Generate random bytes if no input
      randomBytes(16);

  // Adjust the bytes to match UUID v4 format
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // Set version to 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // Set variant to 10xx

  return [
    byteToHex[bytes[0]],
    byteToHex[bytes[1]],
    byteToHex[bytes[2]],
    byteToHex[bytes[3]],
    "-",
    byteToHex[bytes[4]],
    byteToHex[bytes[5]],
    "-",
    byteToHex[bytes[6]],
    byteToHex[bytes[7]],
    "-",
    byteToHex[bytes[8]],
    byteToHex[bytes[9]],
    "-",
    byteToHex[bytes[10]],
    byteToHex[bytes[11]],
    byteToHex[bytes[12]],
    byteToHex[bytes[13]],
    byteToHex[bytes[14]],
    byteToHex[bytes[15]],
  ].join("");
};

export const filenameToUuidV4 = (filename?: string): string | undefined => {
  if (!filename) return undefined; // this is a guard clause, needed for legacy code

  return generateUuidV4(filename);
};

export const generateUniqueId = (length: number = 24): string => {
  // Generate a unique id of a given length
  // These IDs only contain lowercase letters and numbers, so they are safe to use in URLs and file names

  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let uniqueId = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    uniqueId += chars[randomIndex];
  }
  return uniqueId;
};
