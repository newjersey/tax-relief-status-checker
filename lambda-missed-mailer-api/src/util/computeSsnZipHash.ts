import { createHash } from "crypto";

/**
 * Computes the SHA-256 hash of a SSN/ZIP pair to use as the DynamoDB partition key. Hashing avoids
 * storing raw PII in the database.
 */
export const computeSsnZipHash = (ssn: string, zip: string): string => {
  return createHash("sha256").update(`${ssn}|${zip}`).digest("hex");
};
