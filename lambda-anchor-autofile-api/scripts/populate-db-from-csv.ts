/**
 * Reads a CSV file containing TPID and Zip columns, extracts SSN (characters 1–9 of TPID) and ZIP
 * (first 5 characters of Zip column), hashes them together, and writes the resulting ssnZipHash
 * values to the DynamoDB autofile table.
 *
 * Usage: npx tsx scripts/seed-from-csv.ts <path-to-csv> [--table <table-name>] [--region <region>]
 *
 * Example: npx tsx scripts/seed-from-csv.ts ~/Desktop/autofile-test-data.csv --table
 * anchor-autofile-ssn-zip-dev
 */
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import { DynamoDBClient, BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import type { WriteRequest } from "@aws-sdk/client-dynamodb";
import { computeSsnZipHash } from "../src/index.js";

/** Configuration parsed from CLI arguments. */
interface SeedConfig {
  /** Path to the input CSV file. */
  readonly csvPath: string;

  /** DynamoDB table name. */
  readonly tableName: string;

  /** AWS region for the DynamoDB client. */
  readonly region: string;
}

/** Maximum items per DynamoDB BatchWriteItem call. */
const BATCH_SIZE = 25;

const SSN_PATTERN = /^\d{9}$/;
const ZIP_PATTERN = /^\d{5}$/;

/** Parses CLI arguments into a SeedConfig. */
const parseArgs = (): SeedConfig => {
  const args = process.argv.slice(2);
  const csvPath = args.find((arg) => !arg.startsWith("--"));

  if (!csvPath) {
    console.error(
      "Usage: npx tsx scripts/seed-from-csv.ts <path-to-csv> [--table <name>] [--region <region>]",
    );
    process.exit(1);
  }

  const tableIndex = args.indexOf("--table");
  const tableName = tableIndex !== -1 ? args[tableIndex + 1] : "anchor-autofile-ssn-zip-dev";

  const regionIndex = args.indexOf("--region");
  const region = regionIndex !== -1 ? args[regionIndex + 1] : "us-east-1";

  return { csvPath, tableName, region };
};

/** Extracts SSN from a TPID value (characters at index 1–9). */
const extractSsnFromTpid = (tpid: string): string => {
  return tpid.slice(1, 10);
};

/** Extracts 5-digit ZIP from the Zip column value. */
const extractZipCode = (rawZip: string): string => {
  return rawZip.slice(0, 5);
};

/** Sends a batch of write requests to DynamoDB. */
const writeBatch = async (
  client: DynamoDBClient,
  tableName: string,
  requests: WriteRequest[],
): Promise<void> => {
  const command = new BatchWriteItemCommand({
    RequestItems: { [tableName]: requests },
  });

  const result = await client.send(command);
  const unprocessed = result.UnprocessedItems?.[tableName];

  if (unprocessed && unprocessed.length > 0) {
    console.warn(`Retrying ${unprocessed.length} unprocessed items from batch...`);
    await writeBatch(client, tableName, unprocessed);
  }
};

/** Reads the CSV and returns hashed write requests. */
const processFile = async (csvPath: string): Promise<WriteRequest[]> => {
  const stream = createReadStream(csvPath, { encoding: "utf-8" });
  const lines = createInterface({ input: stream });

  const requests: WriteRequest[] = [];
  let headerParsed = false;
  let tpidIndex = -1;
  let zipIndex = -1;
  let lineNumber = 0;
  let skipped = 0;

  for await (const line of lines) {
    lineNumber++;

    const columns = line.replace(/^\uFEFF/, "").split(",");

    if (!headerParsed) {
      tpidIndex = columns.findIndex((col) => col.trim().toUpperCase() === "TPID");
      zipIndex = columns.findIndex((col) => col.trim().toUpperCase() === "ZIP");

      if (tpidIndex === -1 || zipIndex === -1) {
        console.error(
          `CSV must contain TPID and Zip columns. Found headers: ${columns.join(", ")}`,
        );
        process.exit(1);
      }

      headerParsed = true;
      continue;
    }

    const tpid = columns[tpidIndex]?.trim();
    const rawZip = columns[zipIndex]?.trim();

    if (!tpid || !rawZip) {
      skipped++;
      continue;
    }

    const ssn = extractSsnFromTpid(tpid);
    const zip = extractZipCode(rawZip);

    if (!SSN_PATTERN.test(ssn)) {
      console.warn(
        `Line ${lineNumber}: invalid SSN extracted from TPID "${tpid}" → "${ssn}", skipping`,
      );
      skipped++;
      continue;
    }

    if (!ZIP_PATTERN.test(zip)) {
      console.warn(
        `Line ${lineNumber}: invalid ZIP extracted from "${rawZip}" → "${zip}", skipping`,
      );
      skipped++;
      continue;
    }

    const hash = computeSsnZipHash(ssn, zip);

    requests.push({
      PutRequest: {
        Item: { ssnZipHash: { S: hash } },
      },
    });
  }

  console.log(
    `Processed ${lineNumber - 1} data rows. Valid: ${requests.length}, Skipped: ${skipped}`,
  );

  return requests;
};

const main = async (): Promise<void> => {
  const config = parseArgs();

  console.log(`Reading CSV: ${config.csvPath}`);
  console.log(`Target table: ${config.tableName}`);
  console.log(`Region: ${config.region}`);
  console.log();

  const requests = await processFile(config.csvPath);

  if (requests.length === 0) {
    console.log("No valid records to write. Exiting.");
    return;
  }

  const client = new DynamoDBClient({ region: config.region });
  let written = 0;

  for (let i = 0; i < requests.length; i += BATCH_SIZE) {
    const batch = requests.slice(i, i + BATCH_SIZE);
    await writeBatch(client, config.tableName, batch);
    written += batch.length;
    console.log(`Written ${written}/${requests.length} items`);
  }

  console.log(`\nDone. Successfully wrote ${written} items to ${config.tableName}.`);
};

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
