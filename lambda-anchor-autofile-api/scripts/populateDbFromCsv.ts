/**
 * Reads a CSV file containing TPID and Zip columns, extracts SSN (characters 1–9 of TPID) and ZIP
 * (first 5 characters of Zip column), hashes them together, and writes the resulting ssnZipHash
 * values to the DynamoDB autofile table.
 *
 * Usage: npx tsx scripts/populateDbFromCsv.ts <path-to-csv> [--table <table-name>] [--region
 * <region>]
 *
 * Example: npx tsx scripts/populateDbFromCsv.ts ~/Desktop/autofile-test-data.csv --table
 * anchor-autofile-ssn-zip-dev
 */
import { createReadStream } from "node:fs";
import { parse } from "csv-parse";
import { DynamoDBClient, BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import type { WriteRequest } from "@aws-sdk/client-dynamodb";
import { computeSsnZipHash } from "../src/util/computeSsnZipHash";

interface SeedConfig {
  readonly csvPath: string;
  readonly tableName: string;
  readonly region: string;
}

/** Maximum items per DynamoDB BatchWriteItem call. */
const BATCH_SIZE = 25;
const DEFAULT_TABLE_NAME = "anchor-autofile-ssn-zip-dev";
const DEFAULT_REGION = "us-east-1";

const SSN_PATTERN = /^\d{9}$/;
const ZIP_PATTERN = /^\d{5}$/;

const parseArgs = (): SeedConfig => {
  const args = process.argv.slice(2);
  const csvPath = args.find((arg) => !arg.startsWith("--"));

  if (!csvPath) {
    console.error(
      "Usage: npx tsx scripts/populateDbFromCsv.ts <path-to-csv> [--table <name>] [--region <region>]",
    );
    process.exit(1);
  }

  const tableIndex = args.indexOf("--table");
  const tableName = tableIndex !== -1 ? args[tableIndex + 1] : DEFAULT_TABLE_NAME;

  const regionIndex = args.indexOf("--region");
  const region = regionIndex !== -1 ? args[regionIndex + 1] : DEFAULT_REGION;

  return { csvPath, tableName, region };
};

/** Extracts SSN from a TPID (Taxpayer ID) value (characters at index 1–9). */
const extractSsnFromTpid = (tpid: string): string => {
  return tpid.slice(1, 10);
};

/** Extracts 5-digit ZIP from the ZIP column value. */
const extractZipCode = (rawZip: string): string => {
  return rawZip.slice(0, 5);
};

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

const processFile = async (csvPath: string): Promise<WriteRequest[]> => {
  const stream = createReadStream(csvPath, { encoding: "utf-8" });
  const parser = stream.pipe(parse({ columns: true, trim: true, bom: true }));

  const requests: WriteRequest[] = [];
  let rowNumber = 0;
  let skipped = 0;

  for await (const record of parser) {
    rowNumber++;

    const tpid = record["TPID"];
    const rawZip = record["Zip"];

    if (!tpid || !rawZip) {
      console.warn(`Row ${rowNumber}: missing TPID or ZIP, skipping`);
      skipped++;
      continue;
    }

    const ssn = extractSsnFromTpid(tpid);
    const zip = extractZipCode(rawZip);

    if (!SSN_PATTERN.test(ssn)) {
      console.warn(
        `Row ${rowNumber}: invalid SSN extracted from TPID "${tpid}" → "${ssn}", skipping`,
      );
      skipped++;
      continue;
    }

    if (!ZIP_PATTERN.test(zip)) {
      console.warn(`Row ${rowNumber}: invalid ZIP extracted from "${rawZip}" → "${zip}", skipping`);
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

  console.log(`Processed ${rowNumber} data rows. Valid: ${requests.length}, Skipped: ${skipped}`);

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
