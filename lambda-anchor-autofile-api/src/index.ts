import { createHash } from "node:crypto";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

/** Input shape for the autofile lookup request. */
export interface AutofileLookupRequest {
  /** The 9-digit Social Security Number. */
  readonly ssn: string;

  /** The 5-digit ZIP code. */
  readonly zip: string;
}

/** Response shape returned by the autofile lookup API. */
export interface AutofileLookupResponse {
  /** Whether the SSN/ZIP pair is planned for ANCHOR autofile. */
  readonly autofilePlanned: boolean;
}

const dynamoClient = new DynamoDBClient({});

/**
 * Computes the SHA-256 hash of a SSN/ZIP pair to use as the DynamoDB partition key. Hashing avoids
 * storing raw PII in the database.
 */
export const computeSsnZipHash = (ssn: string, zip: string): string => {
  return createHash("sha256").update(`${ssn}|${zip}`).digest("hex");
};

/** Validates that the event contains a valid SSN and ZIP. */
const validateEvent = (event: unknown): AutofileLookupRequest | null => {
  if (!event || typeof event !== "object") return null;

  const { ssn, zip } = event as Record<string, unknown>;

  if (typeof ssn !== "string" || !/^\d{9}$/.test(ssn)) return null;
  if (typeof zip !== "string" || !/^\d{5}$/.test(zip)) return null;

  return { ssn, zip };
};

/** Response shape returned when validation fails. */
export interface AutofileLookupErrorResponse {
  /** Machine-readable error identifier. */
  readonly error: string;
}

/** Lambda handler for the ANCHOR autofile lookup. Invoked directly (not via API Gateway). */
export const handler = async (
  event: unknown,
): Promise<AutofileLookupResponse | AutofileLookupErrorResponse> => {
  const TABLE_NAME = process.env.TABLE_NAME;

  if (!TABLE_NAME) {
    throw new Error("TABLE_NAME environment variable is not configured");
  }

  const request = validateEvent(event);
  if (!request) {
    return { error: "Request must include ssn (9 digits) and zip (5 digits)" };
  }

  const ssnZipHash = computeSsnZipHash(request.ssn, request.zip);

  const result = await dynamoClient.send(
    new GetItemCommand({
      TableName: TABLE_NAME,
      Key: { ssnZipHash: { S: ssnZipHash } },
    }),
  );

  return { autofilePlanned: result.Item !== undefined };
};
