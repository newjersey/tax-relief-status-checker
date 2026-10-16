/**
 * Local helper script to compute the SHA-256 hash of a SSN/ZIP pair.
 *
 * Usage: npx tsx scripts/hash-ssn-zip.ts <ssn> <zip>
 *
 * Example: npx tsx scripts/hash-ssn-zip.ts 123456789 07001
 */
import { computeSsnZipHash } from "../src/util/computeSsnZipHash";

const SSN_PATTERN = /^\d{9}$/;
const ZIP_PATTERN = /^\d{5}$/;

const [ssn, zip] = process.argv.slice(2);

if (!ssn || !zip) {
  console.error("Usage: npx tsx scripts/hash-ssn-zip.ts <ssn> <zip>");
  process.exit(1);
}

if (!SSN_PATTERN.test(ssn)) {
  console.error(`Invalid SSN: must be exactly 9 digits, got "${ssn}"`);
  process.exit(1);
}

if (!ZIP_PATTERN.test(zip)) {
  console.error(`Invalid ZIP: must be exactly 5 digits, got "${zip}"`);
  process.exit(1);
}

const hash = computeSsnZipHash(ssn, zip);

console.log(`SSN:  ${ssn}`);
console.log(`ZIP:  ${zip}`);
console.log(`Hash: ${hash}`);
